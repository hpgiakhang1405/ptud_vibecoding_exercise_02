import type { ReaderRecord } from "@/lib/types";

export function printReaderCard(item: ReaderRecord) {
  const popup = window.open("", "_blank", "width=920,height=720");
  if (!popup) {
    return false;
  }

  popup.document.write(`
    <!doctype html>
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <title>Thẻ thư viện - ${escapeHtml(item.ho_ten)}</title>
        <style>
          :root {
            --primary: #2563EB;
            --primary-light: #EFF6FF;
            --gray-100: #F1F5F9;
            --gray-900: #0F172A;
            --shadow-md: 0 4px 16px rgba(0,0,0,0.10);
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: var(--gray-100);
            font-family: "DM Sans", Arial, sans-serif;
            color: var(--gray-900);
          }
          .card {
            width: 88mm;
            min-height: 56mm;
            border-radius: 16px;
            padding: 16px;
            background:
              radial-gradient(circle at top right, rgba(255,255,255,0.28), transparent 30%),
              linear-gradient(145deg, #1D4ED8, #2563EB 58%, #4F46E5);
            color: white;
            position: relative;
            overflow: hidden;
            box-shadow: var(--shadow-md);
          }
          .brand {
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.75);
          }
          .title {
            margin-top: 6px;
            font-size: 20px;
            font-weight: 700;
            line-height: 1.1;
            max-width: 72%;
          }
          .meta {
            margin-top: 14px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px 10px;
            font-size: 10px;
          }
          .meta strong {
            display: block;
            margin-bottom: 3px;
            color: rgba(255,255,255,0.72);
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .code {
            margin-top: 14px;
            display: inline-flex;
            border-radius: 999px;
            padding: 7px 11px;
            background: rgba(255,255,255,0.14);
            font-size: 11px;
            font-weight: 700;
          }
          @media print {
            body { background: white; }
            .card { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand">Thu vien DH</div>
          <div class="title">${escapeHtml(item.ho_ten)}</div>
          <div class="meta">
            <div><strong>Lop</strong>${escapeHtml(item.lop)}</div>
            <div><strong>Ngay sinh</strong>${escapeHtml(item.ngay_sinh)}</div>
            <div><strong>Gioi tinh</strong>${escapeHtml(item.gioi_tinh)}</div>
            <div><strong>Trang thai</strong>${escapeHtml(item.trang_thai)}</div>
          </div>
          <div class="code">${escapeHtml(item.ma_doc_gia)}</div>
        </div>
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);
  popup.document.close();
  return true;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
