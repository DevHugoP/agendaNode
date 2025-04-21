import MainLayout from '../layouts/MainLayout';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <img
          src="https://illustrations.popsy.co/gray/web-error.svg"
          alt="Page non trouvée"
          className="w-64 h-64 mb-8"
          loading="lazy"
        />
        <h1 className="text-5xl font-bold text-agenda-purple mb-4">Oups ! 404</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-xl">
          Désolé, la page que vous cherchez n’existe pas ou a été déplacée.<br />
          Mais pas de panique, vous pouvez revenir à l’accueil ou explorer d’autres fonctionnalités !
        </p>
        <a
          href="/"
          className="inline-block bg-agenda-purple hover:bg-agenda-purple-dark text-white font-semibold px-6 py-3 rounded-lg shadow transition"
        >
          Retour à l’accueil
        </a>
      </div>
    </MainLayout>
  );
}
