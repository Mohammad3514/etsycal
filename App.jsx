
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";

function App() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    productPrice: "",
    materialCost: "",
    shippingCost: "",
    laborCost: "",
    marketingCost: "",
  });

  const [savedCalculations, setSavedCalculations] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("etsyCalculations");
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const calculateFees = () => {
    const price = parseFloat(formData.productPrice) || 0;
    const materials = parseFloat(formData.materialCost) || 0;
    const shipping = parseFloat(formData.shippingCost) || 0;
    const labor = parseFloat(formData.laborCost) || 0;
    const marketing = parseFloat(formData.marketingCost) || 0;

    const listingFee = 0.20;
    const transactionFee = price * 0.065;
    const paymentProcessingFee = price * 0.03 + 0.25;
    
    const totalCosts = materials + shipping + labor + marketing + listingFee + transactionFee + paymentProcessingFee;
    const profit = price - totalCosts;
    const profitMargin = (profit / price) * 100;

    return {
      listingFee,
      transactionFee,
      paymentProcessingFee,
      totalCosts,
      profit,
      profitMargin
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.productPrice) {
      toast({
        title: "Error",
        description: "Please enter at least the product price",
        variant: "destructive",
      });
      return;
    }

    const results = calculateFees();
    const newCalculation = {
      ...formData,
      ...results,
      date: new Date().toLocaleDateString(),
      id: Date.now(),
    };

    const updatedCalculations = [...savedCalculations, newCalculation];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem("etsyCalculations", JSON.stringify(updatedCalculations));

    toast({
      title: "Calculation saved!",
      description: "Your profit calculation has been saved successfully.",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const results = calculateFees();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-purple-800">
          Etsy Profit Calculator
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Price ($)
                </label>
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Cost ($)
                </label>
                <input
                  type="number"
                  name="materialCost"
                  value={formData.materialCost}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Cost ($)
                </label>
                <input
                  type="number"
                  name="shippingCost"
                  value={formData.shippingCost}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labor Cost ($)
                </label>
                <input
                  type="number"
                  name="laborCost"
                  value={formData.laborCost}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketing Cost ($)
                </label>
                <input
                  type="number"
                  name="marketingCost"
                  value={formData.marketingCost}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors"
            >
              Save Calculation
            </Button>
          </form>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-purple-800">Results</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Listing Fee</p>
              <p className="text-lg font-semibold">${results.listingFee.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Transaction Fee</p>
              <p className="text-lg font-semibold">${results.transactionFee.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Payment Processing Fee</p>
              <p className="text-lg font-semibold">${results.paymentProcessingFee.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Costs</p>
              <p className="text-lg font-semibold">${results.totalCosts.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg col-span-2">
              <p className="text-sm text-gray-600">Estimated Profit</p>
              <p className="text-2xl font-bold text-green-600">${results.profit.toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                Profit Margin: {results.profitMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>

        {savedCalculations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-lg shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-purple-800">Saved Calculations</h2>
            <div className="space-y-4">
              {savedCalculations.map((calc) => (
                <div
                  key={calc.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        Product Price: ${parseFloat(calc.productPrice).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Profit: ${calc.profit.toFixed(2)} ({calc.profitMargin.toFixed(1)}%)
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{calc.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
      <Toaster />
    </div>
  );
}

export default App;
