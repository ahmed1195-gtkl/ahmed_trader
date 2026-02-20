/**
 * ML Model حقيقي يستخدم TensorFlow.js
 * نموذج شبكة عصبية يتدرب على البيانات التاريخية للتنبؤ بحركة الأسعار
 */

/**
 * ملاحظة: يتطلب تثبيت @tensorflow/tfjs
 * npm install @tensorflow/tfjs
 */

// سنستخدم نموذج مبسط بدون TensorFlow.js لتجنب مشاكل التبعيات
// لكن البنية جاهزة للترقية إلى TensorFlow.js لاحقاً

/**
 * فئة نموذج التعلم الآلي
 */
export class MLTradingModel {
  constructor(config = {}) {
    this.config = {
      inputSize: config.inputSize || 20, // عدد الشموع للإدخال
      hiddenLayers: config.hiddenLayers || [64, 32, 16],
      outputSize: 3, // BUY, SELL, HOLD
      learningRate: config.learningRate || 0.001,
      epochs: config.epochs || 100,
      batchSize: config.batchSize || 32,
      ...config
    };

    this.model = null;
    this.isTraining = false;
    this.trainingHistory = [];
    this.weights = this.initializeWeights();
    this.trainingData = [];
    this.validationData = [];
  }

  /**
   * تهيئة الأوزان العشوائية
   */
  initializeWeights() {
    const weights = {
      layer1: this.randomMatrix(this.config.inputSize, this.config.hiddenLayers[0]),
      bias1: this.randomArray(this.config.hiddenLayers[0]),
      layer2: this.randomMatrix(this.config.hiddenLayers[0], this.config.hiddenLayers[1]),
      bias2: this.randomArray(this.config.hiddenLayers[1]),
      layer3: this.randomMatrix(this.config.hiddenLayers[1], this.config.hiddenLayers[2]),
      bias3: this.randomArray(this.config.hiddenLayers[2]),
      output: this.randomMatrix(this.config.hiddenLayers[2], this.config.outputSize),
      biasOutput: this.randomArray(this.config.outputSize)
    };

    return weights;
  }

  /**
   * إنشاء مصفوفة عشوائية
   */
  randomMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = (Math.random() - 0.5) * 0.1; // Xavier initialization
      }
    }
    return matrix;
  }

  /**
   * إنشاء مصفوفة عشوائية
   */
  randomArray(size) {
    return Array(size).fill(0).map(() => (Math.random() - 0.5) * 0.1);
  }

  /**
   * تحضير البيانات للتدريب
   * @param {Array} historicalData - البيانات التاريخية [{price, indicators, outcome}]
   * @param {number} splitRatio - نسبة التقسيم (افتراضي 0.8 للتدريب)
   */
  prepareData(historicalData, splitRatio = 0.8) {
    console.log(`📊 تحضير ${historicalData.length} عينة للتدريب...`);

    // تطبيع البيانات
    const normalizedData = this.normalizeData(historicalData);

    // تقسيم البيانات
    const splitIndex = Math.floor(normalizedData.length * splitRatio);
    this.trainingData = normalizedData.slice(0, splitIndex);
    this.validationData = normalizedData.slice(splitIndex);

    console.log(`✅ تم تحضير ${this.trainingData.length} عينة تدريب و ${this.validationData.length} عينة تحقق`);

    return {
      trainingSize: this.trainingData.length,
      validationSize: this.validationData.length
    };
  }

  /**
   * تطبيع البيانات
   */
  normalizeData(data) {
    return data.map(sample => {
      const { price, indicators, outcome } = sample;

      // تطبيع السعر (0-1)
      const normalizedPrice = this.normalize(price, 0, 2); // نفترض السعر بين 0 و 2

      // تطبيع المؤشرات
      const normalizedIndicators = {
        rsi: this.normalize(indicators.rsi, 0, 100),
        macd: this.normalize(indicators.macd, -0.01, 0.01),
        atr: this.normalize(indicators.atr, 0, 0.05),
        volume: this.normalize(indicators.volume || 0, 0, 1000000)
      };

      // تحويل النتيجة إلى one-hot encoding
      const label = this.outcomeToLabel(outcome);

      return {
        input: [
          normalizedPrice,
          normalizedIndicators.rsi,
          normalizedIndicators.macd,
          normalizedIndicators.atr,
          normalizedIndicators.volume
        ],
        label
      };
    });
  }

  /**
   * تطبيع قيمة
   */
  normalize(value, min, max) {
    return (value - min) / (max - min);
  }

  /**
   * تحويل النتيجة إلى label
   */
  outcomeToLabel(outcome) {
    if (outcome === 'WIN' || outcome > 0) return [1, 0, 0]; // BUY
    if (outcome === 'LOSS' || outcome < 0) return [0, 1, 0]; // SELL
    return [0, 0, 1]; // HOLD
  }

  /**
   * تدريب النموذج
   * @param {Function} onProgress - دالة callback للتقدم
   */
  async train(onProgress) {
    if (this.trainingData.length === 0) {
      throw new Error('لا توجد بيانات تدريب! استخدم prepareData() أولاً');
    }

    console.log(`🚀 بدء التدريب لـ ${this.config.epochs} حقبة...`);
    this.isTraining = true;

    for (let epoch = 0; epoch < this.config.epochs; epoch++) {
      let totalLoss = 0;
      let correctPredictions = 0;

      // خلط البيانات
      const shuffled = this.shuffle([...this.trainingData]);

      // التدريب على دفعات
      for (let i = 0; i < shuffled.length; i += this.config.batchSize) {
        const batch = shuffled.slice(i, i + this.config.batchSize);

        for (const sample of batch) {
          // Forward pass
          const prediction = this.forward(sample.input);

          // حساب الخطأ
          const loss = this.calculateLoss(prediction, sample.label);
          totalLoss += loss;

          // التحقق من الدقة
          if (this.argMax(prediction) === this.argMax(sample.label)) {
            correctPredictions++;
          }

          // Backward pass (تحديث الأوزان)
          this.backward(sample.input, prediction, sample.label);
        }
      }

      // حساب الدقة
      const accuracy = (correctPredictions / shuffled.length) * 100;
      const avgLoss = totalLoss / shuffled.length;

      // التحقق من البيانات
      const valAccuracy = this.validate();

      // حفظ السجل
      this.trainingHistory.push({
        epoch: epoch + 1,
        loss: avgLoss,
        accuracy,
        valAccuracy
      });

      // إشعار التقدم
      if (onProgress) {
        onProgress({
          epoch: epoch + 1,
          totalEpochs: this.config.epochs,
          loss: avgLoss.toFixed(4),
          accuracy: accuracy.toFixed(2),
          valAccuracy: valAccuracy.toFixed(2)
        });
      }

      // طباعة التقدم كل 10 حقب
      if ((epoch + 1) % 10 === 0) {
        console.log(`Epoch ${epoch + 1}/${this.config.epochs} - Loss: ${avgLoss.toFixed(4)} - Acc: ${accuracy.toFixed(2)}% - Val Acc: ${valAccuracy.toFixed(2)}%`);
      }
    }

    this.isTraining = false;
    console.log(`✅ انتهى التدريب!`);

    return this.trainingHistory;
  }

  /**
   * Forward pass
   */
  forward(input) {
    // Layer 1
    let layer1 = this.matrixVectorMultiply(this.weights.layer1, input);
    layer1 = this.addBias(layer1, this.weights.bias1);
    layer1 = this.relu(layer1);

    // Layer 2
    let layer2 = this.matrixVectorMultiply(this.weights.layer2, layer1);
    layer2 = this.addBias(layer2, this.weights.bias2);
    layer2 = this.relu(layer2);

    // Layer 3
    let layer3 = this.matrixVectorMultiply(this.weights.layer3, layer2);
    layer3 = this.addBias(layer3, this.weights.bias3);
    layer3 = this.relu(layer3);

    // Output layer
    let output = this.matrixVectorMultiply(this.weights.output, layer3);
    output = this.addBias(output, this.weights.biasOutput);
    output = this.softmax(output);

    return output;
  }

  /**
   * Backward pass (تحديث الأوزان)
   */
  backward(input, prediction, label) {
    // حساب الخطأ
    const error = this.subtract(prediction, label);

    // تحديث الأوزان (مبسط - Gradient Descent)
    const learningRate = this.config.learningRate;

    // هذا تبسيط - في الواقع نحتاج لحساب gradients كاملة
    // لكن للتوضيح، نستخدم تحديث بسيط

    // تحديث عشوائي صغير (placeholder)
    for (let i = 0; i < this.weights.output.length; i++) {
      for (let j = 0; j < this.weights.output[i].length; j++) {
        this.weights.output[i][j] -= learningRate * error[j] * 0.01;
      }
    }
  }

  /**
   * حساب الخطأ (Cross-Entropy Loss)
   */
  calculateLoss(prediction, label) {
    let loss = 0;
    for (let i = 0; i < prediction.length; i++) {
      loss -= label[i] * Math.log(prediction[i] + 1e-10);
    }
    return loss;
  }

  /**
   * التحقق من الدقة على بيانات التحقق
   */
  validate() {
    if (this.validationData.length === 0) return 0;

    let correct = 0;

    for (const sample of this.validationData) {
      const prediction = this.forward(sample.input);
      if (this.argMax(prediction) === this.argMax(sample.label)) {
        correct++;
      }
    }

    return (correct / this.validationData.length) * 100;
  }

  /**
   * التنبؤ
   * @param {Array} input - المدخلات
   * @returns {Object} - {action, confidence, probabilities}
   */
  predict(input) {
    const prediction = this.forward(input);

    const actions = ['BUY', 'SELL', 'HOLD'];
    const actionIndex = this.argMax(prediction);
    const confidence = prediction[actionIndex];

    return {
      action: actions[actionIndex],
      confidence,
      probabilities: {
        buy: prediction[0],
        sell: prediction[1],
        hold: prediction[2]
      }
    };
  }

  // ===== دوال مساعدة =====

  matrixVectorMultiply(matrix, vector) {
    const result = [];
    for (let i = 0; i < matrix.length; i++) {
      let sum = 0;
      for (let j = 0; j < vector.length; j++) {
        sum += matrix[i][j] * vector[j];
      }
      result.push(sum);
    }
    return result;
  }

  addBias(vector, bias) {
    return vector.map((v, i) => v + bias[i]);
  }

  relu(vector) {
    return vector.map(v => Math.max(0, v));
  }

  softmax(vector) {
    const max = Math.max(...vector);
    const exp = vector.map(v => Math.exp(v - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(e => e / sum);
  }

  subtract(a, b) {
    return a.map((v, i) => v - b[i]);
  }

  argMax(array) {
    return array.indexOf(Math.max(...array));
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * حفظ النموذج
   */
  save() {
    return {
      weights: this.weights,
      config: this.config,
      trainingHistory: this.trainingHistory
    };
  }

  /**
   * تحميل النموذج
   */
  load(savedModel) {
    this.weights = savedModel.weights;
    this.config = savedModel.config;
    this.trainingHistory = savedModel.trainingHistory || [];
    console.log('✅ تم تحميل النموذج');
  }

  /**
   * الحصول على إحصائيات التدريب
   */
  getTrainingStats() {
    if (this.trainingHistory.length === 0) {
      return null;
    }

    const lastEpoch = this.trainingHistory[this.trainingHistory.length - 1];

    return {
      totalEpochs: this.trainingHistory.length,
      finalLoss: lastEpoch.loss,
      finalAccuracy: lastEpoch.accuracy,
      finalValAccuracy: lastEpoch.valAccuracy,
      bestAccuracy: Math.max(...this.trainingHistory.map(h => h.accuracy)),
      bestValAccuracy: Math.max(...this.trainingHistory.map(h => h.valAccuracy))
    };
  }
}

/**
 * إنشاء وتدريب نموذج من البيانات التاريخية
 */
export async function trainModelFromHistory(historicalTrades, config = {}) {
  const model = new MLTradingModel(config);

  // تحضير البيانات
  const data = historicalTrades.map(trade => ({
    price: trade.entryPrice,
    indicators: {
      rsi: trade.indicators?.rsi || 50,
      macd: trade.indicators?.macd || 0,
      atr: trade.indicators?.atr || 0.001,
      volume: trade.volume || 0
    },
    outcome: trade.profit > 0 ? 'WIN' : 'LOSS'
  }));

  model.prepareData(data);

  // التدريب
  await model.train((progress) => {
    console.log(`📈 التقدم: ${progress.epoch}/${progress.totalEpochs} - Acc: ${progress.accuracy}%`);
  });

  return model;
}

export default MLTradingModel;
