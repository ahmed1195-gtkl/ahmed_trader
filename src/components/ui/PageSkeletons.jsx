import React from 'react';
import { Skeleton } from './skeleton';

// Skeleton for the Feed / Community Page
export const FeedSkeleton = () => {
  return (
    <div className="py-12 md:py-20 bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 max-w-3xl space-y-10">
        {/* Title and Buttons Header */}
        <div className="flex items-center justify-between mb-10">
          <Skeleton className="h-10 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>
        </div>

        {/* Dynamic posts (3 of them) */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-zinc-900/40 border border-white/5 backdrop-blur-md overflow-hidden rounded-[2.5rem] p-6 space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>

            {/* Post text */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Image/Media block (alternate show) */}
            {i !== 2 && (
              <Skeleton className="w-full aspect-video rounded-3xl" />
            )}

            {/* Actions list */}
            <div className="flex items-center gap-8 pt-4 border-t border-white/5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for Dashboards (Admin, Challenge, Trading panels)
export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        {/* Page title skeleton */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-10 h-10 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Main interactive grid (Chart + Sidebar/Panel) */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
            {/* Simulation of Chart Canvas */}
            <div className="relative h-80 flex flex-col justify-between pt-4">
              <div className="w-full flex justify-between">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-3 w-8" />
                ))}
              </div>
              <Skeleton className="absolute inset-x-0 bottom-4 top-12 w-full rounded-2xl" />
              <div className="w-full flex justify-between pt-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-3 w-12" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel/Sidebar Form */}
          <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 space-y-6">
            <Skeleton className="h-6 w-36" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
              <Skeleton className="h-14 w-full rounded-2xl mt-6" />
            </div>
          </div>
        </div>

        {/* Data Table Skeleton */}
        <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-3">
            {/* Table headers */}
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
            </div>
            {/* Table rows */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/12" />
                <Skeleton className="h-4 w-1/12" />
                <Skeleton className="h-4 w-1/6 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for Messages and Chat page
export const ChatSkeleton = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-6">
      <div className="container mx-auto px-4 max-w-6xl h-[calc(100vh-8.5rem)] flex gap-6">
        {/* Chat sidebar list */}
        <div className="w-80 bg-zinc-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 hidden md:flex flex-col gap-6">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="flex-1 space-y-6 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message details/view area */}
        <div className="flex-1 bg-zinc-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>

          {/* Messages content (scrollable view simulation) */}
          <div className="flex-1 py-6 space-y-4 overflow-hidden">
            <div className="flex gap-2 items-end max-w-[70%]">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <Skeleton className="h-12 w-48 rounded-2xl rounded-bl-none" />
            </div>
            <div className="flex gap-2 items-end justify-end max-w-[70%] ml-auto">
              <Skeleton className="h-10 w-64 rounded-2xl rounded-br-none" />
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            </div>
            <div className="flex gap-2 items-end max-w-[70%]">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <Skeleton className="h-16 w-56 rounded-2xl rounded-bl-none" />
            </div>
            <div className="flex gap-2 items-end justify-end max-w-[70%] ml-auto">
              <Skeleton className="h-12 w-36 rounded-2xl rounded-br-none" />
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            </div>
          </div>

          {/* Footer input action */}
          <div className="pt-4 border-t border-white/5 flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for books grid, academy or list pages
export const BooksSkeleton = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-10">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>

        {/* Books Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-zinc-900/40 border border-white/5 backdrop-blur-md rounded-3xl overflow-hidden p-4 space-y-4">
              {/* Cover mock */}
              <Skeleton className="w-full aspect-[3/4] rounded-2xl" />
              {/* Title & info */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton for profile header and sections
export const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Cover + Avatar Header Layout */}
        <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <Skeleton className="h-40 w-full" />
          <div className="p-8 -mt-16 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <Skeleton className="w-32 h-32 rounded-full border-4 border-black shrink-0 shadow-2xl" />
              <div className="space-y-2 pb-2">
                <Skeleton className="h-6 w-48 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
              </div>
            </div>
            <div className="flex gap-3 pb-2">
              <Skeleton className="h-12 w-32 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Two Col profile sections */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl rounded-[2rem] p-6 space-y-6">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-zinc-900/40 border border-white/5 backdrop-blur-md rounded-[2.5rem] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
