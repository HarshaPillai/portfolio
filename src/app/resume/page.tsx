export default function ResumePage() {
  return (
    <div style={{ padding: "48px 48px 80px" }}>
      <iframe
        src="/documents/HarshaPillai_Resume.pdf"
        style={{
          display: "block",
          width: "100%",
          height: "calc(100vh - 160px)",
          border: "none",
        }}
        title="Résumé"
      />
    </div>
  );
}
