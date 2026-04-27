export default function ResumePage() {
  return (
    <div style={{ padding: "80px 48px 0" }}>
      <iframe
        src="/documents/HarshaPillai_Resume.pdf"
        style={{
          display: "block",
          width: "100%",
          height: "calc(100vh - 80px)",
          border: "none",
        }}
        title="Résumé"
      />
    </div>
  );
}
