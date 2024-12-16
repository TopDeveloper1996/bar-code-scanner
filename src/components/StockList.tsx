interface Item {
  id: number;
  name: string;
  sku: string;
  ref: string;
  image: string;
  quantity: number;
  lastEdit: string;
}

const items: Item[] = [
  {
    id: 1,
    name: "Therabody Go",
    sku: "THE-SMA",
    ref: "E46-T98",
    image: "https://via.placeholder.com/50",
    quantity: 50,
    lastEdit: "10/08/2024",
  },
  {
    id: 2,
    name: "Smart Goggles",
    sku: "AR-SMA",
    ref: "E46-T76",
    image: "https://via.placeholder.com/50",
    quantity: 35,
    lastEdit: "10/08/2024",
  },
  {
    id: 3,
    name: "Smart Watch",
    sku: "SMA-WA",
    ref: "1234567890",
    image: "https://via.placeholder.com/50",
    quantity: 92,
    lastEdit: "10/08/2024",
  },
  {
    id: 4,
    name: "Laptop iGoser",
    sku: "LAP-LAP",
    ref: "99771-KKTOK",
    image: "https://via.placeholder.com/50",
    quantity: 34,
    lastEdit: "10/08/2024",
  },
  {
    id: 5,
    name: "Earpods ePdro",
    sku: "EAR-EAR",
    ref: "971-EATTH",
    image: "https://via.placeholder.com/50",
    quantity: 120,
    lastEdit: "10/08/2024",
  },
];

const StockList = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Stock &gt; Electrical</h1>
        <p className="text-gray-500 text-lg font-semibold">2318 items</p>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-lg"
            />

            {/* Details */}
            <div className="flex-1 ml-4">
              <p className="text-gray-800 font-bold text-lg">{item.name}</p>
              <p className="text-gray-500 text-sm">
                Item Ref: {item.ref}
              </p>
              <p className="text-gray-400 text-sm">Last Edit: {item.lastEdit}</p>
            </div>

            {/* Quantity */}
            <div className="text-center mr-4">
              <p className="text-gray-800 font-semibold text-xl">
                {item.quantity}
              </p>
              <p className="text-gray-500 text-sm">items</p>
            </div>

            {/* Barcode and Edit */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-8 bg-gray-200 flex items-center justify-center rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v18m16.5-18v18m-7.5-18v18m-6-12h1.5m12 0h1.5M9.75 6v6m0 0h-3m0 0v6m10.5-6h-3m0 0V6"
                  />
                </svg>
              </div>

              <button className="mt-2 text-red-500 hover:text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25m0 0h-7.5M15.75 5.25L12 3m0 0L8.25 5.25m0 0V9m7.5 3.75V18a2.25 2.25 0 01-2.25 2.25h-4.5A2.25 2.25 0 016 18v-5.25"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockList;
