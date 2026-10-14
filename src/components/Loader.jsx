import Image from 'next/image';

const Loader = () => {
  return (
    <html>
    <body className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#ffffff] px-4">
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-black/60 border-r-black/20" />

          <div className="absolute inset-3 flex items-center justify-center rounded-full bg-amber-300/70 shadow-[0_0_45px_rgba(255,255,255,0.3)]">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24">
              <Image
                src="/media/kki.webp"
                width={300}
                height={300}
                alt="Kavya Kishor International"
                priority
                className="h-full w-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black" />
        </div>

        <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-black/60">
          Connecting people &amp; ideas
        </p>
      </div>
    </body>
    </html>
  );
};

export default Loader;