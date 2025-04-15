
import DILAChatbot from '@/components/DILAChatbot';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-dila-lightgray">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png"
              alt="DILA Logo" 
              className="h-10"
              onError={(e) => {
                e.currentTarget.src = "logo.png";
              }}
            />
            <div>
              <h1 className="text-xl font-bold text-dila-dark">Assistant DILA</h1>
              <p className="text-sm text-gray-500">Direction de l'information légale et administrative</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          <h2 className="text-2xl font-bold text-dila-blue mb-6">Assistance virtuelle</h2>
          <div className="h-[600px] shadow-md rounded-lg overflow-hidden">
            <DILAChatbot />
          </div>
          <div className="mt-6 bg-dila-gray rounded-lg p-4 text-sm text-gray-600">
            <p className="font-semibold mb-2">À propos de cet assistant</p>
            <p>
              Cet assistant de la DILA est conçu pour vous aider à trouver des informations sur les services administratifs
              et les démarches légales en France. Pour des informations officielles et complètes, veuillez consulter
              <a href="https://www.service-public.fr" target="_blank" rel="noopener noreferrer" className="text-dila-blue hover:underline"> service-public.fr</a>.
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-dila-blue text-white py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>© {new Date().getFullYear()} - Direction de l'information légale et administrative</p>
          <p className="mt-1">
            <a href="#" className="hover:underline">Mentions légales</a> | 
            <a href="#" className="hover:underline"> Politique de confidentialité</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
