export default function Contact() {
  return (
    <section id="contact" className="bg-section py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title mb-6">
            Let's talk about boosting your IAP revenue
          </h2>
          <p className="text-xl text-gray-600">
            Ready to maximize ARPU? We're here to help you monetize.
          </p>
        </div>

        {/* Calendly Widget */}
        <div className="flex justify-center mb-16">
          <div className="calendly-inline-widget" data-url="https://calendly.com/vikram-battalapalli/30-min?hide_event_type_details=1&hide_gdpr_banner=1" style={{width:'500px',height:'500px'}}></div>
        </div>

        {/* Contact Methods */}
        <div className="flex justify-center">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
            {/* Email */}
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-2">Email</h3>
              <p className="text-lg text-gray-600 mb-2">Quick responses, real people.</p>
              <a href="mailto:hello@trynandi.com" className="text-lg text-black underline">
                hello@trynandi.com
              </a>
            </div>

            {/* Chat */}
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-2">Chat</h3>
              <p className="text-lg text-gray-600 mb-2">Join our community for quick support</p>
              <a href="https://discord.gg/uyADMgnV" target="_blank" rel="noopener noreferrer" className="text-lg text-black underline">
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}