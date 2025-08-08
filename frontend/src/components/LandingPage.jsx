import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-400">PayMate</h1>
            <div className="space-x-2">
              <Link to="/signin" className="px-4 py-2 text-gray-300 hover:text-white">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Sign Up</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-4">Send Money Quickly & Safely</h1>
          <p className="text-lg text-gray-300 mb-6">Transfer money to friends and family with just a few clicks!</p>
          <Link to="/signup" className="px-6 py-3 bg-indigo-600 text-white rounded-md text-lg hover:bg-indigo-700">
            Get Started
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureCard 
            title="Fast Transfers" 
            description="Send money instantly to anyone" 
            icon="⚡" 
          />
          <FeatureCard 
            title="Secure" 
            description="Your transactions are protected" 
            icon="🔒" 
          />
          <FeatureCard 
            title="No Hidden Fees" 
            description="Transparent pricing with no surprises" 
            icon="💰" 
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300">
            <li>Create an account with your email</li>
            <li>Add someone to send money to</li>
            <li>Enter the amount and send!</li>
          </ol>
        </div>
      </main>

      <footer className="bg-gray-800 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2023 PayMate. A Simple Money Transfer App.</p>
          <p className="mt-2">Created for demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}