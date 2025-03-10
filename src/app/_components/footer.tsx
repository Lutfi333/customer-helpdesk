export default function Footer() {
  return (
    <footer className="bg-white h-[45px] flex items-center z-20">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <div>
            <p className="text-sm text-slate-600 ">
              © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
