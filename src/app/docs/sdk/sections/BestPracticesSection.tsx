export function BestPracticesSection() {
  const practices = [
    {
      title: '1. Initialize Early',
      description: 'Initialize the SDK as early as possible in your game\'s lifecycle, ideally right after player authentication. This ensures all events are properly tracked.'
    },
    {
      title: '2. Track All Store Interactions',
      description: 'Track store views, item views, and clicks—not just purchases. This data helps the algorithm understand the full conversion funnel and optimize more effectively.'
    },
    {
      title: '3. Include Player Context',
      description: 'Pass relevant player metadata during initialization (level, VIP status, spending history). This helps Nandi segment players and optimize prices for different player types.'
    },
    {
      title: '4. Handle Errors Gracefully',
      description: 'Always wrap SDK calls in try-catch blocks and have fallback pricing ready in case of network issues. Never let SDK errors break your purchase flow.'
    },
    {
      title: '5. Cache Variant Data',
      description: 'Cache variant data locally after fetching to reduce API calls and improve performance. Refresh the cache periodically or when the store is reopened.'
    },
    {
      title: '6. Test in Sandbox',
      description: 'Always test your integration in sandbox environments before going live. Verify that purchases are tracked correctly and receipts are validated.'
    },
    {
      title: '7. Monitor Performance',
      description: 'Regularly check your dashboard to monitor experiment performance. Look for significant changes in conversion rates and revenue to ensure everything is working correctly.'
    },
    {
      title: '8. Server-Side Verification',
      description: 'Always verify purchases server-side using receipt validation. Never trust client-side purchase data alone for granting items or currency.'
    }
  ];

  return (
    <section id="best-practices" className="mb-12">
      <h2 className="text-3xl font-bold text-black mb-6">Best Practices</h2>

      <div className="space-y-4">
        {practices.map((practice, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{practice.title}</h3>
            <p className="text-sm text-gray-600">{practice.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}