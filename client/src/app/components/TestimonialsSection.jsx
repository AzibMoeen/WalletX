"use client";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-primary uppercase tracking-wide">
            Testimonials
          </h2>
          <p className="mt-1 text-3xl md:text-4xl font-bold text-foreground">
            What our users are saying
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-muted-foreground">
            Thousands of people trust WalletX for their digital payment needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            initials="SA"
            name="Sarah A."
            role="Freelancer"
            rating={5}
            content="WalletX has revolutionized how I receive payments from clients worldwide. It's fast, secure, and the fees are much lower than traditional methods."
          />

          <TestimonialCard
            initials="MJ"
            name="Michael J."
            role="Small Business Owner"
            rating={5}
            content="The payment request feature is a game-changer for my business. I can track who has paid and send automated reminders. Customer support is also excellent."
          />

          <TestimonialCard
            initials="LK"
            name="Lisa K."
            role="Student"
            rating={4}
            content="Splitting bills and expenses with roommates has never been easier. The app interface is intuitive and the instant transfers make sharing costs so convenient."
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ initials, name, role, rating, content }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
          {initials}
        </div>
        <div className="ml-4">
          <h4 className="font-semibold text-foreground">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <div className="text-yellow-400 flex mb-3">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${i >= rating ? "text-muted/30" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-muted-foreground">&quot;{content}&quot;</p>
    </div>
  );
}
