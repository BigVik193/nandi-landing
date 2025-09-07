export default function Contact() {
  return (
    <section id="contact" className="bg-section py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title mb-6">
            Let's talk about boosting your sales
          </h2>
          <p className="text-xl text-gray-600">
            Got questions? We're here to help you thrive.
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
              <a href="mailto:hello@gettula.com" className="text-lg text-black underline">
                hello@gettula.com
              </a>
            </div>

            {/* Call */}
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-2">Call</h3>
              <p className="text-lg text-gray-600 mb-2">8am–8pm, 7 days a week PST</p>
              <a href="tel:+14104178663" className="text-lg text-black underline">
                (410) 417-8663
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}