// Struktur halaman (judul, grup, deskripsi). Link yang diisi admin disimpan di database, bukan di sini.
// Kolom "url" di sini hanya link bawaan (boleh dikosongkan).
module.exports = {
  groups: [
    { id: "dokumen", title: "Panduan & Dokumen" },
    { id: "kumpul", title: "Pengumpulan" }
  ],
  items: [
    { id: "panduan", group: "dokumen", tag: "PDF", title: "Panduan dari LPPM", desc: "Panduan resmi pelaksanaan magang dari LPPM.", url: "https://drive.google.com/file/d/1a7Pz-CWN7KjSrsL0nxdLN7zmWACdicwf/view?usp=drive_link" },
    { id: "fproposal", group: "dokumen", tag: "Template", title: "Format Laporan Proposal", desc: "Template dan ketentuan penulisan proposal magang.", url: "" },
    { id: "flaporan", group: "dokumen", tag: "Template", title: "Format Laporan Magang", desc: "Template dan ketentuan penulisan laporan akhir magang.", url: "" },
    { id: "logbook", group: "dokumen", tag: "Form", title: "Logbook Magang", desc: "Form logbook kegiatan selama magang.", url: "" },
    { id: "contoh", group: "dokumen", tag: "Contoh", title: "Contoh Kerja Praktik", desc: "Contoh laporan kerja praktik sebagai referensi.", url: "" },
    { id: "RPCP", group: "dokumen", tag: "Template", title: "RCPC Magang", desc: "Rencana Pembelajaran dan Capaian Pembelajaran.", url: "" },

    { id: "kproposal", group: "kumpul", tag: "Form", title: "Pengumpulan Proposal", desc: "Form pengumpulan laporan proposal magang.", url: "" },
    { id: "klaporan", group: "kumpul", tag: "Form", title: "Pengumpulan Laporan", desc: "Form pengumpulan laporan akhir magang.", url: "" },
    { id: "knilai", group: "kumpul", tag: "Form", title: "Scan Nilai Akhir", desc: "Form unggah scan nilai akhir dari instansi.", url: "" },
    { id: "kproyek", group: "kumpul", tag: "Form", title: "Penggunaan Proyek dari Instansi", desc: "Form pengumpulan bukti penggunaan proyek oleh instansi.", url: "" }
  ]
};
