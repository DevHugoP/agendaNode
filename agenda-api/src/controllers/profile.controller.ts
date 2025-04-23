import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Non authentifié" });
      return;
    }

    // On fetch le profil ET les infos publiques du user
    const profile = await prisma.profile.findUnique({ where: { userId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!profile || !user) {
      res.status(404).json({ error: "Profil ou utilisateur non trouvé" });
      return;
    }

    // On construit un objet plat avec toutes les infos utiles pour le front
    res.json({
      id: profile.id,
      userId: user.id,
      email: user.email,
      phone: user.phone,
      fullName: profile.fullName ?? user.name,
      profession: profile.profession,
      company: profile.company,
      address: profile.address,
      website: profile.website,
      bio: profile.bio,
      avatar: profile.avatar,
      // Ajoute ici d'autres champs si besoin
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Non authentifié" });
      return;
    }

    const data = req.body;
    // On sépare les champs User et Profile
    const userUpdates: any = {};
    if (typeof data.fullName === "string") userUpdates.name = data.fullName;
    if (typeof data.email === "string") {
      // Vérifie unicité de l'email
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existing && existing.id !== userId) {
        return res
          .status(409)
          .json({ error: "Cet email est déjà utilisé par un autre compte." });
      }
      userUpdates.email = data.email;
    }
    if (typeof data.phone === "string") userUpdates.phone = data.phone;
    // On ne permet pas de changer l'id ici (sécurité)
    delete data.email;
    delete data.id;
    delete data.userId;
    delete data.fullName;
    delete data.phone;

    // On ne garde dans data QUE les champs du modèle Profile
    const allowedProfileFields = [
      "fullName",
      "profession",
      "company",
      "address",
      "website",
      "bio",
      "avatar",
    ];
    const profileData: any = {};
    for (const key of allowedProfileFields) {
      if (typeof data[key] !== "undefined") profileData[key] = data[key];
    }

    const tx: any[] = [
      prisma.profile.update({
        where: { userId },
        data: profileData,
      }),
    ];
    if (Object.keys(userUpdates).length > 0) {
      tx.push(prisma.user.update({ where: { id: userId }, data: userUpdates }));
    }
    const [profile, user] = await prisma.$transaction(tx);
    res.json({ profile, user });
  } catch (error) {
    next(error);
  }
};
