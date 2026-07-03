"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function LegalPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("kvkk");

  const tabs = [
    { id: "kvkk", name: "KVKK Metni" },
    { id: "mesafeli-satis", name: "Mesafeli Satış Sözleşmesi" },
    { id: "on-bilgilendirme", name: "Ön Bilgilendirme Formu" },
    { id: "gizlilik", name: "Gizlilik & Güvenlik" },
  ];

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabs.map((t) => t.id).includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/legal?tab=${tabId}`, { scroll: false });
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-8 animate-fade-in">
      {/* Tabs list sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="glass-card p-5 border border-[#2a2a35] rounded-xl space-y-2">
          <h3 className="text-xs font-bold tracking-widest font-serif text-[#d4af37] mb-4 uppercase">
            SÖZLEŞMELER VE YASAL
          </h3>
          <div className="flex flex-col space-y-1.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`text-left text-xs px-3.5 py-3 rounded-lg transition-all font-semibold tracking-wide ${
                  activeTab === t.id
                    ? "bg-gold-gradient text-[#0a0a0c] shadow-md shadow-[#d4af37]/15"
                    : "text-gray-400 hover:bg-[#18181f] hover:text-white"
                }`}
                id={`legal-tab-btn-${t.id}`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Document content */}
      <section className="flex-1 glass-card p-8 border border-[#2a2a35] rounded-xl text-xs md:text-sm text-gray-300 leading-relaxed space-y-6">
        {activeTab === "kvkk" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-[#d4af37] border-b border-[#2a2a35] pb-3 uppercase">
              KVKK Aydınlatma Metni
            </h2>
            <p>
              <strong>TEFEKKÜR MECLİSİ KİTAP EVİ</strong> (Rıdvan Yılmaz Turizm Seyahat Acentesi Ltd. Şti.) olarak, müşterilerimizin kişisel verilerinin korunmasına ve güvenliğine büyük önem vermekteyiz. Bu kapsamda, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri sorumlusu sıfatıyla hazırladığımız aydınlatma metnini bilgilerinize sunarız.
            </p>
            <h4 className="font-bold text-white font-serif mt-4">1. İşlenen Kişisel Verileriniz ve Toplanma Amacı</h4>
            <p>
              Web sitemiz üzerinden gerçekleştirdiğiniz alışverişlerde ad soyad, iletişim bilgileri (telefon, e-posta), fatura ve teslimat adresi verileriniz toplanmaktadır. Bu veriler:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>Siparişlerinizin işlenmesi, paketlenmesi ve adresinize teslim edilmesi,</li>
              <li>Yasal fatura ve muhasebe yükümlülüklerinin yerine getirilmesi,</li>
              <li>Satış sonrası destek, iptal ve iade süreçlerinin yönetilmesi,</li>
              <li>Olası uyuşmazlıklarda yetkili mercilere bilgi verilmesi amaçlarıyla işlenmektedir.</li>
            </ul>
            <h4 className="font-bold text-white font-serif mt-4">2. Verilerin Aktarımı</h4>
            <p>
              Toplanan kişisel verileriniz, yalnızca sipariş sözleşmesinin kurulması ve ifası (Kargo şirketleri, PayTR ödeme aracı kuruluşu) ile kanuni yükümlülüklerin yerine getirilmesi (Maliye Bakanlığı, denetleyici merciler) kapsamında iş ortaklarımız ve yasal mercilerle paylaşılmaktadır. Verileriniz reklam veya pazarlama amacıyla izniniz olmaksızın üçüncü şahıslara aktarılmaz.
            </p>
          </div>
        )}

        {activeTab === "mesafeli-satis" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-[#d4af37] border-b border-[#2a2a35] pb-3 uppercase">
              Mesafeli Satış Sözleşmesi
            </h2>
            <p>
              <strong>MADDE 1 - TARAFLAR:</strong>
            </p>
            <p>
              <strong>SATICI:</strong> Rıdvan Yılmaz Turizm Seyahat Acentesi Ltd. Şti.<br />
              Adres: Reyhan Mah. 8. Park Sok. Baycan Plaza No: 10 Kat: 4 Daire: 2, Osmangazi/Bursa<br />
              Telefon: 0538 399 96 66<br />
              E-posta: iletisim@ridvanyilmazturizm.com
            </p>
            <p>
              <strong>ALICI:</strong> TEFEKKÜR MECLİSİ KİTAP EVİ internet sitesi üzerinden sipariş oluşturan ve ödemesini gerçekleştiren tüketici.
            </p>
            <p>
              <strong>MADDE 2 - SÖZLEŞMENİN KONUSU:</strong><br />
              İşbu sözleşmenin konusu, Alıcının Satıcıya ait internet sitesinden elektronik ortamda siparişini yaptığı, özellikleri ve satış fiyatı belirtilen ürünlerin satışı ve teslimi ile ilgili olarak Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>
            <p>
              <strong>MADDE 3 - CAYMA HAKKI VE İADE:</strong><br />
              Alıcı, satın aldığı basılı yayınları (kitap vb.) teslim tarihinden itibaren 14 (ondört) gün içinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin cayma hakkını kullanarak iade edebilir. İade edilecek kitabın ambalajının açılmamış, kullanılmamış ve satılabilir özelliğini yitirmemiş olması gerekmektedir. İade kargo ücreti, kusurlu ürünler hariç Alıcıya aittir.
            </p>
          </div>
        )}

        {activeTab === "on-bilgilendirme" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-[#d4af37] border-b border-[#2a2a35] pb-3 uppercase">
              Ön Bilgilendirme Formu
            </h2>
            <p>
              İşbu form, Alıcının elektronik ortamda onaylayacağı Mesafeli Satış Sözleşmesi öncesinde bilgilendirilmesi amacıyla hazırlanmıştır.
            </p>
            <ul className="list-decimal pl-5 space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-300">Ürünlerin Temel Nitelikleri:</strong> Alışveriş sepetinde ve sipariş özetinde belirtilen kitapların adeti, yazarı ve yayın evidir.
              </li>
              <li>
                <strong className="text-gray-300">Toplam Fiyat:</strong> Ürünlerin KDV dahil satış fiyatı, kargo bedeli (seçildiyse) ve kapıda ödeme hizmet bedeli (seçildiyse) toplamıdır.
              </li>
              <li>
                <strong className="text-gray-300">Teslimat Bilgileri:</strong> Ürünler, Alıcının formda belirttiği adrese kargo firması (MNG veya Yurtiçi) aracılığıyla veya Alıcı tarafından Bursa Osmangazi acentemizden teslim alınarak ifa edilecektir.
              </li>
              <li>
                <strong className="text-gray-300">Şikayet ve Çözüm:</strong> Tüketici şikayetleri için Rıdvan Yılmaz Turizm Bursa şubesi ile iletişime geçebilir, uyuşmazlıklarda ise Tüketici Hakem Heyetleri yetkilidir.
              </li>
            </ul>
          </div>
        )}

        {activeTab === "gizlilik" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-[#d4af37] border-b border-[#2a2a35] pb-3 uppercase">
              Gizlilik & Güvenlik Politikası
            </h2>
            <p>
              Tefekkür Meclisi Kitap Evi olarak, müşterilerimizin kredi kartı ve ödeme güvenliklerini en üst seviyede tutmaktayız.
            </p>
            <h4 className="font-bold text-white font-serif mt-4">1. Ödeme Güvenliği ve PayTR Altyapısı</h4>
            <p>
              Sitemizde gerçekleştirilen kredi kartı ödemeleri, Türkiye'nin önde gelen lisanslı ödeme kuruluşu <strong>PayTR</strong> altyapısı ile güvence altındadır. Kart bilgileriniz hiçbir şekilde bizim veritabanımızda saklanmaz veya kaydedilmez. Ödeme işlemi 3D Secure güvenli katmanı (banka onay kodu) üzerinden şifreli kanallarla doğrudan PayTR ve bankanız arasında gerçekleşir.
            </p>
            <h4 className="font-bold text-white font-serif mt-4">2. Bilgi Güvenliği (SSL)</h4>
            <p>
              Web sitemizin tüm sayfalarında bilgi transferi 256-bit SSL (Secure Sockets Layer) şifreleme teknolojisi ile korunmaktadır. Tarayıcınızdaki kilit simgesi veri iletişiminizin şifreli ve güvenli olduğunu gösterir.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <div className="bg-[#0a0a0c] min-h-screen">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#121216] to-[#0a0a0c] border-b border-[#2a2a35]/50 py-12 px-6 text-center">
        <h1 className="text-2xl md:text-4xl font-black font-serif text-white tracking-wide">
          YASAL BİLGİLENDİRMELER
        </h1>
      </section>

      <Suspense
        fallback={
          <div className="text-center text-xs text-gray-500 py-12 animate-pulse">
            Yasal metinler yükleniyor...
          </div>
        }
      >
        <LegalPageContent />
      </Suspense>
    </div>
  );
}
