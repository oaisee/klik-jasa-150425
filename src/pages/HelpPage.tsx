
import { useEffect, useState } from 'react';
import { ArrowLeft, HelpCircle, FileText, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const HelpPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Pusat Bantuan | KlikJasa';
  }, []);

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Pusat Bantuan</h1>
      </div>

      <Alert className="mb-4">
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>Butuh bantuan?</AlertTitle>
        <AlertDescription>
          Temukan jawaban untuk pertanyaan umum atau hubungi tim kami melalui opsi di bawah ini.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <FAQSection 
              title="FAQ & Pertanyaan Umum"
              icon={<FileText size={20} className="mr-3 text-gray-500" />}
              faqs={[
                {
                  question: "Apa itu KlikJasa?",
                  answer: "KlikJasa adalah platform yang menghubungkan penyedia jasa lokal dengan konsumen di Indonesia. Kami memfasilitasi pencarian dan pemesanan jasa, namun pembayaran dilakukan secara langsung dengan tunai."
                },
                {
                  question: "Bagaimana cara KlikJasa mendapatkan keuntungan?",
                  answer: "KlikJasa mengambil komisi 5% dari saldo penyedia jasa yang telah diisi sebelumnya (top-up melalui Midtrans) ketika konfirmasi pemesanan dilakukan."
                },
                {
                  question: "Bagaimana cara melakukan pembayaran?",
                  answer: "Pembayaran untuk jasa dilakukan secara langsung kepada penyedia jasa secara tunai. KlikJasa tidak menangani pembayaran untuk jasa yang diberikan."
                },
                {
                  question: "Bagaimana jika saya tidak puas dengan layanan?",
                  answer: "Anda dapat menghubungi tim dukungan kami melalui menu 'Hubungi Kami' untuk melaporkan masalah. Kami akan berusaha untuk menyelesaikan masalah tersebut dengan penyedia jasa."
                }
              ]}
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <FAQSection 
              title="Cara Menggunakan KlikJasa"
              icon={<HelpCircle size={20} className="mr-3 text-gray-500" />}
              faqs={[
                {
                  question: "Bagaimana cara mencari penyedia jasa?",
                  answer: "Di halaman utama, Anda dapat mencari jasa berdasarkan kategori atau menggunakan fitur pencarian. Setelah menemukan jasa yang sesuai, klik untuk melihat detail dan profil penyedia."
                },
                {
                  question: "Bagaimana cara memesan jasa?",
                  answer: "Setelah memilih penyedia jasa, klik tombol 'Request Booking'. Isi detail permintaan dan tunggu konfirmasi dari penyedia jasa. Setelah dikonfirmasi, Anda bisa menghubungi mereka melalui fitur chat."
                },
                {
                  question: "Bagaimana cara menjadi penyedia jasa?",
                  answer: "Klik pada profil Anda dan pilih 'Mode Penyedia'. Isi informasi profil penyedia jasa Anda, tambahkan layanan yang Anda tawarkan dengan detail dan harga, lalu tunggu verifikasi dari tim KlikJasa."
                },
                {
                  question: "Bagaimana cara mengisi saldo sebagai penyedia jasa?",
                  answer: "Pergi ke halaman 'Wallet', klik 'Isi Saldo', dan ikuti petunjuk untuk melakukan top-up melalui Midtrans. Saldo ini akan digunakan untuk membayar komisi KlikJasa saat Anda menerima pemesanan."
                }
              ]}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Mail size={20} className="mr-3 text-gray-500" />
              <h2 className="font-semibold">Kontak Email</h2>
            </div>
            <p className="text-sm text-gray-600 ml-8 mb-3">Kirim pertanyaan atau masalah Anda melalui email:</p>
            <a href="mailto:bantuan@klikjasa.id" className="block text-marketplace-primary ml-8">bantuan@klikjasa.id</a>
            <p className="text-xs text-gray-500 ml-8 mt-2">Respons dalam 1-2 hari kerja</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Phone size={20} className="mr-3 text-gray-500" />
              <h2 className="font-semibold">Hubungi Kami</h2>
            </div>
            <p className="text-sm text-gray-600 ml-8 mb-3">Bicara langsung dengan tim dukungan kami:</p>
            <a href="tel:+628123456789" className="block text-marketplace-primary ml-8">+62 812-3456-7890</a>
            <p className="text-xs text-gray-500 ml-8 mt-2">Senin - Jumat, 09:00 - 17:00 WIB</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface FAQProps {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  icon: React.ReactNode;
  faqs: FAQProps[];
}

const FAQSection = ({ title, icon, faqs }: FAQSectionProps) => {
  return (
    <div>
      <div className="p-4 font-semibold border-b border-gray-100 flex items-center">
        {icon}
        <span>{title}</span>
      </div>
      <div>
        {faqs.map((faq, index) => (
          <FAQ 
            key={index}
            question={faq.question}
            answer={faq.answer}
            isLast={index === faqs.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

interface SingleFAQProps extends FAQProps {
  isLast: boolean;
}

const FAQ = ({ question, answer, isLast }: SingleFAQProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`border-b border-gray-100 ${isLast ? 'border-b-0' : ''}`}
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-50">
        <span className="font-medium">{question}</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-1 text-sm text-gray-600">
        {answer}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default HelpPage;
