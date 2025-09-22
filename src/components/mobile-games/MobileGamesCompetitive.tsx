const CheckMark = () => (
  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black flex items-center justify-center mx-auto">
    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

export default function Competitive() {
  return (
    <section className="bg-section py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium text-black leading-tight font-title mb-6">
            Nandi optimizes revenue while
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>others just analyze
          </h2>
        </div>

        {/* Feature Comparison Chart */}
        <div className="mb-16 max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left py-3 sm:py-4 pr-4 sm:pr-8 border-r border-black w-2/5">
                    <h3 className="text-lg sm:text-xl font-bold text-black">Features</h3>
                  </th>
                  <th className="text-center py-3 sm:py-4 px-4 sm:px-8 border-r border-black w-3/12">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black rounded-lg flex items-center justify-center">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white transform rotate-45"></div>
                      </div>
                      <span className="text-lg sm:text-xl font-bold text-black">Nandi</span>
                    </div>
                  </th>
                  <th className="text-center py-3 sm:py-4 px-4 sm:px-8 w-3/12">
                    <span className="text-lg sm:text-xl font-bold text-black">Competitors</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="text-left py-3 pr-4 sm:pr-8 border-r border-black">
                    <h4 className="font-semibold text-black text-sm sm:text-base lg:text-lg">No App Store Resubmission</h4>
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8 border-r border-black">
                    <CheckMark />
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8">
                    <CheckMark />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="text-left py-3 pr-4 sm:pr-8 border-r border-black">
                    <h4 className="font-semibold text-black text-sm sm:text-base lg:text-lg">Revenue Analytics</h4>
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8 border-r border-black">
                    <CheckMark />
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8">
                    <CheckMark />
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="text-left py-3 pr-4 sm:pr-8 border-r border-black">
                    <h4 className="font-semibold text-black text-sm sm:text-base lg:text-lg">AI IAP Optimization</h4>
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8 border-r border-black">
                    <CheckMark />
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8"></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="text-left py-3 pr-4 sm:pr-8 border-r border-black">
                    <h4 className="font-semibold text-black text-sm sm:text-base lg:text-lg">Dynamic Paywall Builder</h4>
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8 border-r border-black">
                    <CheckMark />
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8"></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="text-left py-3 pr-4 sm:pr-8 border-r border-black">
                    <h4 className="font-semibold text-black text-sm sm:text-base lg:text-lg">24/7 LiveOps Automation</h4>
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8 border-r border-black">
                    <CheckMark />
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8"></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="text-left py-3 pr-4 sm:pr-8 border-r border-black">
                    <h4 className="font-semibold text-black text-sm sm:text-base lg:text-lg">Player Segmentation & Targeting</h4>
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8 border-r border-black">
                    <CheckMark />
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8"></td>
                </tr>
                <tr>
                  <td className="text-left py-3 pr-4 sm:pr-8 border-r border-black">
                    <h4 className="font-semibold text-black text-sm sm:text-base lg:text-lg">Zero Dev Updates Required</h4>
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8 border-r border-black">
                    <CheckMark />
                  </td>
                  <td className="text-center py-3 px-4 sm:px-8"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}