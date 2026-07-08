"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart, isMounted } = useCart();
  const router = useRouter();

  // Form States
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({ street: "", city: "", zip: "", country: "Türkiye" });
  const [shippingMethod, setShippingMethod] = useState("mng"); // mng, yurtiçi, hand
  const [paymentMethod, setPaymentMethod] = useState("havale"); // havale, cod
  const [legalAgreed, setLegalAgreed] = useState(false);
  const [kvkkAgreed, setKvkkAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States for Legal Agreements
  const [activeModal, setActiveModal] = useState(null); // 'kvkk', 'satis', 'bilgi'

  // Shipping cost calculation
  const getShippingCost = () => {
    if (shippingMethod === "yurtici") return 30;
    return 0; // mng (free) or hand delivery (free)
  };

  const getGrandTotal = () => {
    return getCartTotal() + getShippingCost();
  };

  // Process standard order (COD / Havale)
  const handleCompleteOrder = async (e) => {
    if (e) e.preventDefault();

    if (isSubmitting) return;

    if (!legalAgreed || !kvkkAgreed) {
      alert("Lütfen yasal sözleşmeleri ve KVKK metnini onaylayın.");
      return;
    }
    if (!customer.name || !customer.email || !customer.phone || !address.street || !address.city) {
      alert("Lütfen tüm iletişim ve teslimat bilgilerini eksiksiz doldurun.");
      return;
    }

    setIsSubmitting(true);

    const oid = "TM-" + Date.now();

    try {
      const orderPayload = {
        id: oid,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        addressStreet: address.street,
        addressCity: address.city,
        addressZip: address.zip || "",
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
        items: cart,
        totalPrice: getGrandTotal(),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error("Sipariş kaydedilirken bir hata oluştu.");
      }

      clearCart();
      router.push(`/checkout/success?oid=${oid}&method=${paymentMethod}`);
    } catch (err) {
      console.error(err);
      alert("Siparişiniz kaydedilirken sistemsel bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-6 text-center space-y-6">
        <div className="w-16 h-16 bg-[#18181f] border border-[#2a2a35] rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold font-serif text-white">Sepetiniz Boş</h2>
        <p className="text-sm text-gray-400">
          Ödeme sayfasına geçebilmek için sepetinize en az bir kitap eklemiş olmanız gerekmektedir.
        </p>
        <Link
          href="/books"
          className="inline-block px-5 py-2.5 bg-[#d4af37] text-[#0a0a0c] font-bold rounded hover:bg-[#f3e5ab] transition-all text-xs tracking-wider"
        >
          KİTAPLARA GÖZ AT
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0c] min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-white tracking-wider">
          GÜVENLİ <span className="text-gold">ÖDEME</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Info */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleCompleteOrder} className="space-y-6">
                {/* Customer Information */}
                <div className="glass-card p-4 sm:p-6 border border-[#2a2a35] rounded-xl space-y-4">
                  <h3 className="text-base font-bold font-serif text-[#d4af37] border-b border-[#2a2a35] pb-3">
                    1. İLETİŞİM BİLGİLERİ
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ad Soyad</label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Adınızı ve soyadınızı girin"
                        className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-4 py-2.5 text-xs text-gray-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Telefon</label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="Cep telefonu numaranız"
                        className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-4 py-2.5 text-xs text-gray-200 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">E-posta</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="e-posta@adresiniz.com"
                      className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-4 py-2.5 text-xs text-gray-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="glass-card p-4 sm:p-6 border border-[#2a2a35] rounded-xl space-y-4">
                  <h3 className="text-base font-bold font-serif text-[#d4af37] border-b border-[#2a2a35] pb-3">
                    2. TESLİMAT ADRESİ
                  </h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Adres Tarifi</label>
                    <textarea
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="Mahalle, sokak, bina no, daire no..."
                      rows="3"
                      className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-4 py-2.5 text-xs text-gray-200 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Şehir / İl</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="Örn: Bursa"
                        className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-4 py-2.5 text-xs text-gray-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Posta Kodu</label>
                      <input
                        type="text"
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                        placeholder="16000"
                        className="w-full bg-[#202028] border border-[#2a2a35] focus:border-[#d4af37] rounded-lg px-4 py-2.5 text-xs text-gray-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ülke</label>
                      <input
                        type="text"
                        disabled
                        value={address.country}
                        className="w-full bg-[#18181f] border border-[#2a2a35] rounded-lg px-4 py-2.5 text-xs text-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="glass-card p-4 sm:p-6 border border-[#2a2a35] rounded-xl space-y-4">
                  <h3 className="text-base font-bold font-serif text-[#d4af37] border-b border-[#2a2a35] pb-3">
                    3. KARGO / TESLİMAT SEÇENEĞİ
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <label className={`flex items-center justify-between p-4 bg-[#18181f] border rounded-lg cursor-pointer transition-colors ${shippingMethod === "mng" ? "border-[#d4af37]" : "border-[#2a2a35] hover:border-gray-700"}`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "mng"}
                          onChange={() => setShippingMethod("mng")}
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold block text-gray-200">MNG Kargo</span>
                          <span className="text-[10px] text-gray-400">Tüm Türkiye'ye 3-5 iş günü içinde teslimat.</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#d4af37]">ÜCRETSİZ</span>
                    </label>

                    <label className={`flex items-center justify-between p-4 bg-[#18181f] border rounded-lg cursor-pointer transition-colors ${shippingMethod === "yurtici" ? "border-[#d4af37]" : "border-[#2a2a35] hover:border-gray-700"}`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "yurtici"}
                          onChange={() => setShippingMethod("yurtici")}
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold block text-gray-200">Yurtiçi Kargo (Hızlı Kargo)</span>
                          <span className="text-[10px] text-gray-400">Tüm Türkiye'ye 1-3 iş günü içinde hızlı teslimat.</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-300">30.00 TL</span>
                    </label>

                    <label className={`flex items-center justify-between p-4 bg-[#18181f] border rounded-lg cursor-pointer transition-colors ${shippingMethod === "hand" ? "border-[#d4af37]" : "border-[#2a2a35] hover:border-gray-700"}`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "hand"}
                          onChange={() => setShippingMethod("hand")}
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold block text-gray-200">Acenteden Elden Teslim (Bursa)</span>
                          <span className="text-[10px] text-gray-400">Osmangazi'deki Rıdvan Yılmaz Turizm ofisimizden teslim alın.</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#d4af37]">ÜCRETSİZ</span>
                    </label>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="glass-card p-4 sm:p-6 border border-[#2a2a35] rounded-xl space-y-4">
                  <h3 className="text-base font-bold font-serif text-[#d4af37] border-b border-[#2a2a35] pb-3">
                    4. ÖDEME YÖNTEMİ
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex flex-col items-center justify-center p-4 bg-[#18181f] border rounded-lg cursor-pointer transition-colors ${paymentMethod === "havale" ? "border-[#d4af37] bg-[#d4af37]/5" : "border-[#2a2a35] hover:border-gray-700"}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "havale"}
                        onChange={() => setPaymentMethod("havale")}
                        className="mb-2"
                      />
                      <span className="text-xs font-bold text-gray-200">Havale / EFT</span>
                      <span className="text-[9px] text-gray-400 mt-1">Banka Hesap Bilgileri</span>
                    </label>

                    <label className={`flex flex-col items-center justify-center p-4 bg-[#18181f] border rounded-lg cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-[#d4af37] bg-[#d4af37]/5" : "border-[#2a2a35] hover:border-gray-700"}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mb-2"
                      />
                      <span className="text-xs font-bold text-gray-200">Kapıda Ödeme</span>
                      <span className="text-[9px] text-gray-400 mt-1">Nakit / Kargo Kapıda</span>
                    </label>
                  </div>

                  {/* Dynamic payment info */}
                  {paymentMethod === "havale" && (
                    <div className="p-4 bg-[#1e1d18] border border-[#d4af37]/20 rounded-lg space-y-4 mt-4 text-xs text-gray-300">
                      <span className="text-[#d4af37] font-bold block font-serif tracking-wider">
                        HAVALE / EFT YAPILACAK BANKA HESAPLARI:
                      </span>
                      <p className="text-[10px] text-gray-400">
                        * Lütfen havale açıklama kısmına sipariş onayından sonra alacağınız **Sipariş Kodu**'nu yazınız. Havale ulaştıktan sonra siparişiniz kargolanacaktır.
                      </p>
                      
                      {/* Albaraka */}
                      <div className="space-y-1">
                        <span className="font-bold text-white block">Albaraka Türk Katılım Bankası</span>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Alıcı:</span>
                          <span className="text-gray-300">Rıdvan Yılmaz Turizm Seyahat Acentesi Ltd. Şti.</span>
                        </div>
                        <div className="flex justify-between items-center mt-1 bg-[#121216] p-2 rounded">
                          <code className="text-[#d4af37] font-mono text-[10px]">TR88 0020 3000 1094 1251 0000 01</code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText("TR88 0020 3000 1094 1251 0000 01");
                              alert("IBAN kopyalandı.");
                            }}
                            className="text-[9px] bg-[#202028] text-gray-400 hover:text-white px-2 py-1 rounded"
                          >
                            Kopyala
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div className="p-4 bg-[#1e1d18] border border-[#d4af37]/20 rounded-lg text-xs text-gray-300 mt-4">
                      <span className="text-red-400 font-bold block mb-1">KAPIDA ÖDEME HİZMETİ</span>
                      Kapıda nakit veya kartla ödemelerde kargo firması tarafından tahsil edilen ek **15.00 TL** kapıda ödeme hizmet bedeli yansıtılmaktadır.
                    </div>
                  )}
                </div>

                {/* Legal compliance checkboxes */}
                <div className="glass-card p-4 sm:p-6 border border-[#2a2a35] rounded-xl space-y-3">
                  <label className="flex items-start space-x-3 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={legalAgreed}
                      onChange={(e) => setLegalAgreed(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      <button type="button" onClick={() => setActiveModal("satis")} className="text-[#d4af37] hover:underline font-semibold">Mesafeli Satış Sözleşmesi</button>
                      {" "}ve{" "}
                      <button type="button" onClick={() => setActiveModal("bilgi")} className="text-[#d4af37] hover:underline font-semibold">Ön Bilgilendirme Formu</button>
                      'nu okudum ve kabul ediyorum.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={kvkkAgreed}
                      onChange={(e) => setKvkkAgreed(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      <button type="button" onClick={() => setActiveModal("kvkk")} className="text-[#d4af37] hover:underline font-semibold">KVKK Aydınlatma Metni</button>
                      {" "}kapsamında kişisel verilerimin işlenmesini kabul ediyorum.
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-xs font-bold tracking-widest rounded-lg transition-all shadow-lg ${isSubmitting ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-gold-gradient text-[#0a0a0c] hover:bg-none hover:bg-[#f3e5ab] shadow-[#d4af37]/15"}`}
                  id="checkout-submit-btn"
                >
                  {isSubmitting ? "SİPARİŞ ONAYLANIYOR..." : "SİPARİŞİ ONAYLA"}
                </button>
              </form>
            </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-4 sm:p-6 border border-[#2a2a35] rounded-xl space-y-4">
              <h3 className="text-base font-bold font-serif text-[#d4af37] border-b border-[#2a2a35] pb-3">
                SİPARİŞ ÖZETİ
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-xs border-b border-[#2a2a35]/40 pb-2.5 last:border-0 last:pb-0">
                    <div className="text-left space-y-0.5 max-w-[70%]">
                      <span className="font-semibold text-gray-200 block truncate">{item.title}</span>
                      <span className="text-[10px] text-gray-500">{item.author} x {item.quantity}</span>
                    </div>
                    <span className="text-gray-300 font-semibold">{(item.price * item.quantity).toFixed(2)} TL</span>
                  </div>
                ))}
              </div>

              {/* Calculations block */}
              <div className="border-t border-[#2a2a35] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Sepet Toplamı:</span>
                  <span>{getCartTotal().toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Kargo Ücreti:</span>
                  {getShippingCost() === 0 ? (
                    <span className="text-green-400 font-semibold">Ücretsiz</span>
                  ) : (
                    <span>{getShippingCost().toFixed(2)} TL</span>
                  )}
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-gray-400">
                    <span>Kapıda Ödeme Bedeli:</span>
                    <span>15.00 TL</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold border-t border-[#2a2a35] pt-3">
                  <span className="text-gray-200">Genel Toplam:</span>
                  <span className="text-[#d4af37] font-serif">
                    {(getGrandTotal() + (paymentMethod === "cod" ? 15 : 0)).toFixed(2)} TL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Overlays for Legal Agreements */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative bg-[#121216] border border-[#d4af37]/35 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 text-gray-300 shadow-2xl animate-fade-in">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            {activeModal === "kvkk" && (
              <div className="space-y-4 text-xs leading-relaxed">
                <h2 className="text-lg font-bold font-serif text-[#d4af37]">KVKK AYDINLATMA METNİ</h2>
                <p>
                  <strong>Tefekkür Meclisi Kitap Evi</strong> (Rıdvan Yılmaz Turizm) olarak kişisel verilerinizin güvenliğine büyük önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, veri sorumlusu sıfatıyla tarafımıza iletilen ad, soyad, telefon numarası, e-posta adresi ve teslimat adresi gibi verileriniz, yalnızca siparişinizin işlenmesi, fatura kesilmesi, kargo teslimatı ve ödeme işlemlerinin yapılması amacıyla sınırlı olarak işlenecek ve üçüncü taraflarla paylaşılmayacaktır.
                </p>
                <p>
                  Kişisel verileriniz, Kanun'un 5. maddesinde belirtilen "sözleşmenin kurulması ve ifası" hukuki sebebine dayalı olarak otomatik yollarla toplanmaktadır. Haklarınızla ilgili her türlü bilgiye Bursa Osmangazi adresindeki ofisimize yazılı başvurarak ulaşabilirsiniz.
                </p>
              </div>
            )}

            {activeModal === "satis" && (
              <div className="space-y-4 text-xs leading-relaxed">
                <h2 className="text-lg font-bold font-serif text-[#d4af37]">MESAFELİ SATIŞ SÖZLEŞMESİ</h2>
                <p>
                  <strong>1. TARAFLAR:</strong> Satıcı: Rıdvan Yılmaz Turizm Seyahat Acentesi Ltd. Şti. (Reyhan Mah. Osmangazi/Bursa) - Alıcı: Sipariş formunda bilgileri girilen Tüketici.
                </p>
                <p>
                  <strong>2. KONU:</strong> Satıcının, Alıcıya sattığı kitap ve basılı yayınların satışı ve teslimatı ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
                </p>
                <p>
                  <strong>3. TESLİMAT VE İADE:</strong> Satıcı, sipariş edilen malları Alıcının belirttiği adrese kargo firması aracılığıyla teslim edecektir. Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde hiçbir gerekçe göstermeksizin cayma hakkını kullanabilir. İade gönderilen kitapların zarar görmemiş ve satılabilirliğini kaybetmemiş olması şarttır.
                </p>
              </div>
            )}

            {activeModal === "bilgi" && (
              <div className="space-y-4 text-xs leading-relaxed">
                <h2 className="text-lg font-bold font-serif text-[#d4af37]">ÖN BİLGİLENDİRME FORMU</h2>
                <p>
                  Bu form, sipariş etmek istediğiniz ürünlerin temel özellikleri, satış fiyatı, ödeme şekli, teslimat şartları ve cayma hakkına dair ön bilgilendirmeyi içermektedir.
                </p>
                <p>
                  Ürünlerin fiyatı sipariş özetinde belirtildiği şekildedir. Ödemeler kredi kartı (PayTR), havale veya kargo firmasına kapıda yapılabilir. Cayma hakkı taleplerinizi 0538 399 96 66 telefon numarası üzerinden veya Osmangazi/Bursa adresimizdeki acentemize bildirebilirsiniz.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
