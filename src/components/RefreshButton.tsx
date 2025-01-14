import { useData } from "../context/DataProvider";

const RefreshButton = () => {
  const { refreshData, loading } = useData();

  return (
    <button
      onClick={refreshData}
      disabled={loading}
      className="text-xs bg-transparent hover:bg-gray-900 text-gray-700 font-semibold hover:text-white py-1 px-2 border border-gray-300 hover:border-transparent rounded"
    >
      {loading ? "Refreshing..." : "Refresh Data"}
    </button>
  );
};

export default RefreshButton;
