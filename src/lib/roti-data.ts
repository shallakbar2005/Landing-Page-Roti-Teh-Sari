import donat from "@/assets/donat-coklat.jpg";
import sourdough from "@/assets/sourdough.jpg";
import rotiSusu from "@/assets/roti-susu.jpg";
import cinnamon from "@/assets/cinnamon-roll.jpg";
import croissant from "@/assets/croissant.jpg";
import rotiPisang from "@/assets/roti-pisang.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  ready: boolean;
  desc: string;
  alt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "donat-coklat",
    name: "Donat Coklat",
    price: 15000,
    image: donat,
    ready: true,
    desc: "Donat kentang lembut dengan lapisan coklat asli yang meleleh. Digoreng pagi, paling enak dimakan hangat.",
    alt: "Donat kentang dengan glasir coklat tebal di atas piring putih",
  },
  {
    id: "sourdough",
    name: "Sourdough",
    price: 35000,
    image: sourdough,
    ready: true,
    desc: "Fermentasi alami 18 jam, kulitnya garing dan dalamnya kenyal. Tanpa ragi instan, tanpa pengawet.",
    alt: "Roti sourdough bulat dengan kulit renyah di atas kertas roti",
  },
  {
    id: "roti-susu",
    name: "Roti Susu",
    price: 12000,
    image: rotiSusu,
    ready: true,
    desc: "Roti susu ala rumahan, super lembut dan wangi mentega. Favorit anak-anak buat bekal sekolah.",
    alt: "Roti susu putih lembut yang sudah dipotong beberapa slice",
  },
  {
    id: "cinnamon-roll",
    name: "Cinnamon Roll",
    price: 18000,
    image: cinnamon,
    ready: false,
    desc: "Gulungan kayu manis dengan cream cheese glaze. Biasanya habis sebelum jam 9, pesan pagi ya.",
    alt: "Cinnamon roll dengan glasir cream cheese di atas piring keramik",
  },
  {
    id: "croissant",
    name: "Croissant",
    price: 22000,
    image: croissant,
    ready: true,
    desc: "Croissant butter dengan 27 lapis, renyah di luar lembut di dalam. Wanginya kebawa sampai depan rumah.",
    alt: "Croissant mentega berwarna keemasan di atas kain linen krem",
  },
  {
    id: "roti-pisang",
    name: "Roti Pisang",
    price: 14000,
    image: rotiPisang,
    ready: true,
    desc: "Banana bread dari pisang ambon matang, manisnya pas dan moist. Cocok nemenin teh sore.",
    alt: "Roti pisang yang dipotong di atas talenan kayu",
  },
];

export const KECAMATAN = ["Antapani", "Buah Batu", "Cicaheum", "Cikutra", "Dago"];

export const TESTIMONI = [
  { text: "Enak banget lembut!", name: "Rina", area: "Buah Batu" },
  { text: "Sourdough-nya juara, sudah langganan tiap minggu.", name: "Dimas", area: "Cikutra" },
  { text: "Datang masih hangat, anak-anak langsung habis.", name: "Bu Yanti", area: "Antapani" },
  { text: "Harganya jujur, rasanya kayak bakery mahal.", name: "Sandra", area: "Dago" },
];

export const WA_NUMBER = "6281234567890";

export const ONGKIR_GOSEND = 12000;

export const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");
