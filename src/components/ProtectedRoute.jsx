import { Navigate } from 'react-router-dom';

/**
 * مكون حماية المسارات - يتحقق من وجود حساب تجريبي
 * @param {boolean} hasDemoAccount - هل المستخدم لديه حساب تجريبي
 * @param {boolean} isAdmin - هل المستخدم أدمن (الأدمن لا يحتاج حساب تجريبي)
 * @param {JSX.Element} children - المكون المراد حمايته
 */
function ProtectedRoute({ hasDemoAccount, isAdmin, children }) {
  // الأدمن لا يحتاج حساب تجريبي
  if (isAdmin) {
    return children;
  }

  // إذا لم يكن لديه حساب تجريبي، إعادة توجيه لصفحة الإعداد
  if (!hasDemoAccount) {
    return <Navigate to="/setup-account" replace />;
  }

  return children;
}

export default ProtectedRoute;
