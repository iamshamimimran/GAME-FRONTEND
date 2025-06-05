import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white sticky top-0 shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div
          className="text-2xl font-bold cursor-pointer hover:text-red-300 transition-colors"
          onClick={() => navigate("/")}
        >
          QuizMaster
        </div>

        <nav className="flex space-x-4">
          <button
            className="px-4 py-2 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors font-medium"
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <button
            className="px-4 py-2 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors font-medium"
            onClick={() => navigate("/g-pdf")}
          >
            Upload
          </button>
          <button
            className="px-4 py-2 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors font-medium"
            onClick={() => navigate("/pdf-QnA")}
          >
            PDF Chat
          </button>
          <button
            className="px-4 py-2 rounded-lg hover:bg-indigo-700  hover:text-white transition-colors font-medium"
            onClick={() => navigate("/g-prompt")}
          >
            Create Quiz
          </button>
          <button
            className="px-4 py-2 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors font-medium"
            onClick={() => navigate("/library")}
          >
            Library
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
