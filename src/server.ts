import app from "./app";
import { AppDataSource } from "./database/data-source";

// ----------------------------------------------------------------

const port: number = 3000;

(async () => {
  try {
    await AppDataSource.initialize();
    console.log("================================");
    console.log("🛢️ ¡La fuente de datos ha sido inicializada!");

    app.listen(port, () => {
      console.log("🚀 Servidor ejecutándose en el puerto ${port}");
      console.log("================================");
    });
  } catch (error) {
    console.error("⛔ Error durante la inicialización de la fuente de datos", error);
  }
})();
