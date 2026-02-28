import "./globals.css";

export const metadata = {
  title: "Formulario Policial - Palanqueo RP",
  description: "Formulario oficial de reclutamiento para la Policía Nacional de Palanqueo RP.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
