import { Router } from "express";
import authRoutes from "./auth.routes";
import bookRoutes from "./book.routes";
import readerRoutes from "./reader.routes";
import loanRoutes from "./loan.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/libros", bookRoutes);
router.use("/lectores", readerRoutes);
router.use("/prestamos", loanRoutes);

export default router;
