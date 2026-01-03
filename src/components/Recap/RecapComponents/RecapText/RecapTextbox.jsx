function RecapTextbox({ children, translateX = 0, title }) {
  return (
    <div
      className="max-w-md px-2 py-1.5 md:px-3 md:py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 overflow-x-auto"
      style={{
        transform: `translateX(${translateX}px)`,
        boxShadow:
          "0 0 20px rgba(120, 192, 255, 0.15), 0 0 40px rgba(186, 180, 255, 0.13), 0 0 60px rgba(219, 176, 255, 0.1)",
      }}
    >
      {title && (
        <div className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2 lg:mb-2">{title}</div>
      )}
      <div className="text-xs sm:text-base lg:text-lg text-white leading-tight md:leading-7 lg:leading-8 tracking-tight md:tracking-normal opacity-70">{children}</div>
    </div>
  );
}

export default RecapTextbox;
