import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Clock, MapPin, Minus, Plus, ShoppingBag, X } from "lucide-react";

import heroImg from "@/assets/hero-roti.jpg";
import mapImg from "@/assets/map-antapani.jpg";
import {
  KECAMATAN,
  ONGKIR_GOSEND,
  PRODUCTS,
  TESTIMONI,
  WA_NUMBER,
  rupiah,
  type Product,
} from "@/lib/roti-data";

export const Route = createFileRoute("/")({
  component: RotiTehSari,
});

type CartItem = { id: string; name: string; price: number; qty: number };
type Screen = "home" | "checkout" | "success";

function waLink(text: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

function RotiTehSari() {
  const [screen, setScreen] = useState<Screen>("home");
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [sheetQty, setSheetQty] = useState(1);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [orderNo, setOrderNo] = useState("Roti123");
  const catalogRef = useRef<HTMLDivElement>(null);

  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");
  const [metode, setMetode] = useState<"pickup" | "gosend">("pickup");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoadingCatalog(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showBottomSheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showBottomSheet]);

  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const ongkir = metode === "gosend" ? ONGKIR_GOSEND : 0;
  const total = subtotal + ongkir;

  const waValid = /^(08|\+628|628)[0-9]{7,13}$/.test(wa.replace(/[\s-]/g, ""));
  const formValid = nama.trim().length > 1 && waValid && (metode === "pickup" || !!kecamatan);

  const openSheet = (p: Product) => {
    if (!p.ready) return;
    setSelectedProduct(p);
    setSheetQty(1);
    setShowBottomSheet(true);
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const p = selectedProduct;
    setCartItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + sheetQty } : i));
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: sheetQty }];
    });
    setShowBottomSheet(false);
  };

  const setQty = (id: string, qty: number) =>
    setCartItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
    );

  const goCheckout = () => {
    setScreen("checkout");
    window.scrollTo({ top: 0 });
  };

  // Placeholder integrasi Midtrans Snap
  const handlePay = () => {
    setSubmitted(true);
    if (!formValid) return;
    setPaying(true);
    setPayError(false);
    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);
    setTimeout(() => {
      setPaying(false);
      const fail = nextAttempt === 1 && Math.random() < 0.2;
      if (fail) {
        setPayError(true);
        return;
      }
      setOrderNo("Roti" + Math.floor(100 + Math.random() * 900));
      setScreen("success");
      window.scrollTo({ top: 0 });
    }, 1500);
  };

  const resetAll = () => {
    setCartItems([]);
    setScreen("home");
    setNama("");
    setWa("");
    setKecamatan("");
    setAlamat("");
    setCatatan("");
    setMetode("pickup");
    setSubmitted(false);
    setAttempt(0);
    window.scrollTo({ top: 0 });
  };

  const orderText = useMemo(() => {
    const lines = cartItems.map((i) => `- ${i.name} x${i.qty} (${rupiah(i.price * i.qty)})`);
    return [
      `Halo Teh Sari, saya ${nama || "pelanggan"} sudah bayar pesanan #${orderNo}.`,
      "",
      ...lines,
      metode === "gosend"
        ? `Antar GoSend ke ${kecamatan}: ${rupiah(ONGKIR_GOSEND)}`
        : "Ambil di toko",
      `Total: ${rupiah(total)}`,
    ].join("\n");
  }, [cartItems, nama, orderNo, metode, kecamatan, total]);

  if (screen === "success") {
    return (
      <main className="mx-auto min-h-screen max-w-lg px-4 pb-16 pt-16">
        <div className="flex flex-col items-center text-center">
          <div className="animate-pop-check grid h-20 w-20 place-items-center rounded-full bg-[var(--color-success)]">
            <Check className="h-10 w-10 text-white" strokeWidth={3} aria-hidden="true" />
          </div>
          <h1 className="mt-6">Yeay! Pesanan #{orderNo} Lunas</h1>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-success)] px-3 py-1 text-xs font-bold tracking-wide text-white">
            PAID
          </span>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Terima kasih! Roti kamu kami siapkan dan kabari lewat WhatsApp.
          </p>
        </div>

        <div className="card-soft mt-8 p-4">
          <h3>Detail Pesanan</h3>
          <ul className="mt-3 space-y-2">
            {cartItems.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span>
                  {i.name} <span className="text-[var(--muted-foreground)]">x{i.qty}</span>
                </span>
                <span className="font-bold">{rupiah(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <span>{metode === "gosend" ? `Antar GoSend • ${kecamatan}` : "Ambil di Toko"}</span>
              <span>{ongkir ? rupiah(ongkir) : "Gratis"}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold">Total</span>
              <span className="font-display text-2xl font-bold text-[var(--color-primary)]">
                {rupiah(total)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <a
            href={waLink(orderText)}
            target="_blank"
            rel="noreferrer"
            className="btn-base btn-primary w-full"
          >
            Konfirmasi ke WA Teh Sari
          </a>
          <button type="button" onClick={resetAll} className="btn-base btn-outline w-full">
            Pesan Lagi
          </button>
        </div>
      </main>
    );
  }

  if (screen === "checkout") {
    return (
      <>
        <main className="mx-auto min-h-screen max-w-lg px-4 pb-40 pt-4 md:max-w-3xl">
          <button
            type="button"
            onClick={() => {
              setScreen("home");
              window.scrollTo({ top: 0 });
            }}
            className="inline-flex min-h-12 items-center gap-2 font-medium text-[var(--color-primary)]"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Kembali
          </button>

          <h2 className="mt-2">Checkout</h2>

          <section className="card-soft mt-4 p-4">
            <h3>Pesanan Kamu</h3>
            {cartItems.length === 0 ? (
              <p className="mt-2 text-[var(--muted-foreground)]">
                Keranjang masih kosong. Yuk pilih roti dulu.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {cartItems.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="font-display truncate text-base font-semibold text-[var(--color-primary)]">
                        {i.name}
                      </p>
                      <p className="text-sm font-bold">{rupiah(i.price * i.qty)}</p>
                    </div>
                    <Stepper
                      qty={i.qty}
                      onChange={(q) => setQty(i.id, q)}
                      label={`jumlah ${i.name}`}
                      min={0}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card-soft mt-4 space-y-4 p-4">
            <h3>Data Pengiriman</h3>
            <Field label="Nama" required>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama kamu"
                className="input-field"
              />
              {submitted && nama.trim().length < 2 && <ErrorText>Nama wajib diisi.</ErrorText>}
            </Field>

            <Field label="No WhatsApp" required>
              <input
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                inputMode="tel"
                placeholder="08xxxxxxxxxx"
                className="input-field"
              />
              {submitted && !waValid && (
                <ErrorText>Nomor belum valid, contoh: 081234567890.</ErrorText>
              )}
            </Field>

            <Field label="Kecamatan" required={metode === "gosend"}>
              <select
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                className="input-field"
              >
                <option value="">Pilih kecamatan</option>
                {KECAMATAN.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              {submitted && metode === "gosend" && !kecamatan && (
                <ErrorText>Pilih kecamatan untuk pengantaran.</ErrorText>
              )}
            </Field>

            <Field label="Alamat lengkap">
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                rows={3}
                placeholder="Nama jalan, nomor rumah, patokan"
                className="input-field"
              />
            </Field>

            <Field label="Catatan">
              <input
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: jangan pakai wijen ya"
                className="input-field"
              />
            </Field>
          </section>

          <section className="card-soft mt-4 p-4">
            <h3>Cara Terima Roti</h3>
            <div className="mt-3 space-y-3">
              <RadioRow
                checked={metode === "pickup"}
                onSelect={() => setMetode("pickup")}
                title="Ambil di Toko"
                note="Gratis"
              />
              <RadioRow
                checked={metode === "gosend"}
                onSelect={() => setMetode("gosend")}
                title="Antar via GoSend"
                note={`Flat ${rupiah(ONGKIR_GOSEND)}`}
              />
            </div>
          </section>

          <section className="card-soft mt-4 p-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-bold">{rupiah(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm">
              <span>Ongkir</span>
              <span className="font-bold">{ongkir ? rupiah(ongkir) : "Gratis"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="font-bold">Total</span>
              <span className="font-display text-2xl font-bold text-[var(--color-primary)]">
                {rupiah(total)}
              </span>
            </div>
          </section>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[var(--color-surface)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-lg md:max-w-3xl">
            <button
              type="button"
              onClick={handlePay}
              disabled={paying || cartItems.length === 0}
              className="btn-base btn-primary w-full disabled:opacity-60"
            >
              {paying ? "Menyiapkan QRIS..." : `Bayar Pakai QRIS • ${rupiah(total)}`}
            </button>
          </div>
        </div>

        {paying && <PayingOverlay />}
        {payError && (
          <PayErrorModal
            onRetry={() => {
              setPayError(false);
              handlePay();
            }}
            onWa={() => setPayError(false)}
            waHref={waLink(
              `Halo Teh Sari, QRIS saya gagal. Saya mau bayar via WA untuk pesanan total ${rupiah(total)}.`,
            )}
          />
        )}
      </>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b border-border bg-[var(--background)]/95 backdrop-blur">
        <div className="mx-auto grid h-14 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4">
          <span className="font-display truncate text-xl font-bold text-[var(--color-primary)]">
            Roti Teh Sari.
          </span>
          <button
            type="button"
            onClick={() => totalQty > 0 && goCheckout()}
            aria-label={`Keranjang ${totalQty} roti total ${rupiah(subtotal)}`}
            className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[var(--color-primary)]"
          >
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            {totalQty > 0 && (
              <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--color-accent)] px-1 text-xs font-bold text-[var(--color-accent-foreground)]">
                {totalQty}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-4">
        <section>
          <img
            src={heroImg}
            width={1200}
            height={912}
            alt="Nampan kayu berisi aneka roti rumahan yang baru keluar dari oven"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[0px_4px_24px_rgba(74,37,17,0.08)]"
          />
          <h1 className="mt-6">Roti Baru Keluar Oven Tiap Jam 7 Pagi</h1>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Fresh dari Antapani, Bandung. Tanpa pengawet.
          </p>
          <button
            type="button"
            onClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="btn-base btn-primary mt-5 w-full md:w-auto"
          >
            Lihat Roti Hari Ini
          </button>
        </section>

        <div className="mt-12 md:grid md:grid-cols-[minmax(0,1fr)_320px] md:items-start md:gap-8">
          <div>
            <section ref={catalogRef} className="scroll-mt-20">
              <h2>Roti Ready Hari Ini</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Stok terbatas, dibuat harian di dapur rumah.
              </p>

              {loadingCatalog ? (
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="card-soft overflow-hidden p-0">
                      <div className="shimmer aspect-square w-full" />
                      <div className="space-y-2 p-3">
                        <div className="shimmer h-4 w-3/4 rounded" />
                        <div className="shimmer h-4 w-1/2 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : PRODUCTS.length === 0 ? (
                <div className="card-soft mt-4 p-6 text-center">
                  <p className="font-display text-lg font-semibold text-[var(--color-primary)]">
                    Oven masih pemanasan, cek lagi jam 7 pagi ya!
                  </p>
                  <a
                    href={waLink("Halo Teh Sari, roti hari ini sudah ready belum?")}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-base btn-outline mt-4 w-full"
                  >
                    Tanya via WhatsApp
                  </a>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {PRODUCTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => openSheet(p)}
                      disabled={!p.ready}
                      aria-label={`${p.name}, ${rupiah(p.price)}${p.ready ? "" : ", habis hari ini"}`}
                      className="card-soft overflow-hidden text-left disabled:cursor-not-allowed"
                    >
                      <div className="relative">
                        <img
                          src={p.image}
                          width={816}
                          height={816}
                          loading="lazy"
                          alt={p.alt}
                          className={`aspect-square w-full object-cover ${p.ready ? "" : "opacity-60 grayscale-[50%]"}`}
                        />
                        <span
                          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            p.ready
                              ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                              : "bg-black text-white"
                          }`}
                        >
                          {p.ready ? "Ready" : "Habis Hari Ini"}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="font-display text-base font-semibold text-[var(--color-primary)]">
                          {p.name}
                        </p>
                        <p className="mt-0.5 font-bold">{rupiah(p.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-12">
              <h2>Kata Pelanggan</h2>
              <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2">
                {TESTIMONI.map((t) => (
                  <figure
                    key={t.name}
                    className="min-w-[260px] max-w-[260px] rounded-2xl border border-border bg-[var(--background)] p-4"
                  >
                    <blockquote className="font-display text-lg font-semibold text-[var(--color-primary)]">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>
                    <figcaption className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {t.name}, {t.area}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2>Mampir ke Dapur Kami</h2>
              <div className="card-soft mt-4 overflow-hidden">
                <img
                  src={mapImg}
                  width={1200}
                  height={688}
                  loading="lazy"
                  alt="Peta lokasi dapur Roti Teh Sari di Antapani, Bandung"
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="space-y-3 p-4">
                  <p className="flex gap-2">
                    <MapPin
                      className="mt-1 h-5 w-5 shrink-0 text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                    <span>Jl. Purwakarta No. 27, Antapani, Kota Bandung</span>
                  </p>
                  <p className="flex gap-2">
                    <Clock
                      className="mt-1 h-5 w-5 shrink-0 text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                    <span>Senin–Sabtu, 07.00 – 17.00 WIB</span>
                  </p>
                  <a
                    href={waLink("Halo Teh Sari, saya mau tanya-tanya soal roti hari ini.")}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-base btn-outline w-full"
                  >
                    Chat Teh Sari di WhatsApp
                  </a>
                </div>
              </div>
            </section>
          </div>

          <aside className="hidden md:block md:sticky md:top-20">
            <div className="card-soft p-4">
              <h3>Keranjang</h3>
              {cartItems.length === 0 ? (
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Belum ada roti dipilih. Tap roti favoritmu.
                </p>
              ) : (
                <>
                  <ul className="mt-3 divide-y divide-border">
                    {cartItems.map((i) => (
                      <li key={i.id} className="flex items-center justify-between gap-2 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{i.name}</p>
                          <p className="text-sm font-bold">{rupiah(i.price * i.qty)}</p>
                        </div>
                        <Stepper
                          qty={i.qty}
                          onChange={(q) => setQty(i.id, q)}
                          label={`jumlah ${i.name}`}
                          min={0}
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm font-bold">Total</span>
                    <span className="font-display text-xl font-bold text-[var(--color-primary)]">
                      {rupiah(subtotal)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={goCheckout}
                    className="btn-base btn-primary mt-4 w-full"
                  >
                    Checkout
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      {totalQty > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-[var(--color-primary)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div className="min-w-0 text-white">
              <p className="truncate text-sm font-medium">
                {totalQty} Roti • {rupiah(subtotal)}
              </p>
            </div>
            <button
              type="button"
              onClick={goCheckout}
              className="btn-base shrink-0 bg-white px-6 text-[var(--color-primary)]"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {showBottomSheet && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Tutup detail roti"
            onClick={() => setShowBottomSheet(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="animate-sheet-up relative mx-auto w-full max-w-lg rounded-t-3xl bg-[var(--color-surface)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-border" />
            <button
              type="button"
              onClick={() => setShowBottomSheet(false)}
              aria-label="Tutup"
              className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-[var(--color-primary)]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <img
              src={selectedProduct.image}
              width={816}
              height={816}
              alt={selectedProduct.alt}
              className="mt-4 aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <h3 className="mt-4">{selectedProduct.name}</h3>
            <p className="mt-1 font-bold">{rupiah(selectedProduct.price)}</p>
            <p className="mt-2 text-[var(--muted-foreground)]">{selectedProduct.desc}</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-medium">Jumlah</span>
              <Stepper qty={sheetQty} onChange={setSheetQty} label="jumlah roti" min={1} />
            </div>

            <button type="button" onClick={addToCart} className="btn-base btn-primary mt-4 w-full">
              Tambah ke Keranjang - {rupiah(selectedProduct.price * sheetQty)}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Stepper({
  qty,
  onChange,
  label,
  min,
}: {
  qty: number;
  onChange: (q: number) => void;
  label: string;
  min: number;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        disabled={qty <= min && min > 0}
        aria-label={`Kurangi ${label}`}
        className="grid h-8 w-8 place-items-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] disabled:opacity-40"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span aria-live="polite" className="w-6 text-center font-bold">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label={`Tambah ${label}`}
        className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-primary)] text-white"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-[var(--color-error)]"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-sm text-[var(--color-error)]">{children}</p>;
}

function RadioRow({
  checked,
  onSelect,
  title,
  note,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  note: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={checked}
      className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left ${
        checked ? "border-[var(--color-primary)] bg-[var(--background)]" : "border-border"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
            checked ? "border-[var(--color-primary)]" : "border-border"
          }`}
        >
          {checked && <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />}
        </span>
        <span className="truncate font-medium">{title}</span>
      </span>
      <span className="shrink-0 text-sm font-bold">{note}</span>
    </button>
  );
}

function PayingOverlay() {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 px-4">
      <div className="card-soft w-full max-w-sm space-y-3 p-5">
        <div className="shimmer h-5 w-2/3 rounded" />
        <div className="shimmer h-32 w-full rounded-xl" />
        <div className="shimmer h-5 w-1/2 rounded" />
        <p className="pt-1 text-center text-sm text-[var(--muted-foreground)]">
          Menyiapkan QRIS kamu...
        </p>
      </div>
    </div>
  );
}

function PayErrorModal({
  onRetry,
  onWa,
  waHref,
}: {
  onRetry: () => void;
  onWa: () => void;
  waHref: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4" role="alertdialog">
      <div className="card-soft w-full max-w-sm p-5">
        <h3>Pembayaran Gagal</h3>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Rotinya kami simpan 10 menit. Coba bayar lagi ya.
        </p>
        <div className="mt-5 space-y-3">
          <button type="button" onClick={onRetry} className="btn-base btn-primary w-full">
            Coba Lagi
          </button>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            onClick={onWa}
            className="btn-base btn-outline w-full"
          >
            Bayar via WA
          </a>
        </div>
      </div>
    </div>
  );
}
