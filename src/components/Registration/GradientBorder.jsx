export default function GradientBorder({ children, className = "" }) {
  return (
    <div className={`relative rounded-2xl p-[2px] ${className}`}>
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
      <span className="absolute inset-[2px] rounded-2xl bg-gradient-to-r from-purple-950 via-pink-950 to-gray-950" />
      <div className="relative z-10 rounded-2xl bg-gray-950/90 backdrop-blur-sm p-6 md:p-8 ">
        {children}
      </div>
    </div>
  );
}
