import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";

const LegalPage = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Legal Information</h1>

          <section id="terms-of-service" className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 border-b pb-3">Terms of Service</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Welcome to VanTrusty. These terms of service outline the rules and regulations for the use of
                VanTrusty's Website, located at vantrusty.com.
              </p>
              <p>
                By accessing this website we assume you accept these terms of service. Do not continue to use
                VanTrusty if you do not agree to take all of the terms of service stated on this page.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-4">1. License</h3>
              <p>
                Unless otherwise stated, VanTrusty and/or its licensors own the intellectual property rights for
                all material on VanTrusty. All intellectual property rights are reserved. You may access this
                from VanTrusty for your own personal use subjected to restrictions set in these terms of
                service.
              </p>
              <p>You must not:</p>
              <ul>
                <li>Republish material from VanTrusty</li>
                <li>Sell, rent or sub-license material from VanTrusty</li>
                <li>Reproduce, duplicate or copy material from VanTrusty</li>
                <li>Redistribute content from VanTrusty</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-4">2. User Comments</h3>
              <p>
                This Agreement shall begin on the date hereof.
              </p>
              <p>
                Parts of this website offer an opportunity for users to post and exchange opinions and
                information in certain areas of the website. VanTrusty does not filter, edit, publish or
                review Comments prior to their presence on the website. Comments do not reflect the views and
                opinions of VanTrusty,its agents and/or affiliates. Comments reflect the views and opinions of
                the person who post their views and opinions.
              </p>

              <p className="mt-8">
                <strong>This is a placeholder document. You should replace this with your actual Terms of Service.</strong>
              </p>
            </div>
          </section>

          <section id="privacy-policy">
            <h2 className="text-3xl font-semibold mb-6 border-b pb-3">Privacy Policy</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Your privacy is important to us. It is VanTrusty's policy to respect your privacy regarding any
                information we may collect from you across our website, and other sites we own and operate.
              </p>
              <p>
                We only ask for personal information when we truly need it to provide a service to you. We
                collect it by fair and lawful means, with your knowledge and consent. We also let you know why
                we’re collecting it and how it will be used.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-4">Information We Collect</h3>
              <p>
                Log data: When you visit our website, our servers may automatically log the standard data
                provided by your web browser. It may include your computer’s Internet Protocol (IP) address,
                your browser type and version, the pages you visit, the time and date of your visit, the time
                spent on each page, and other details.
              </p>
              <p>
                Personal information: We may ask for personal information, such as your: Name, Email, Social
                media profiles, Date of birth, Phone/mobile number, Home/Mailing address.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-4">Security</h3>
              <p>
                We value your trust in providing us your Personal Information, thus we are striving to use
                commercially acceptable means of protecting it. But remember that no method of transmission over
                the internet, or method of electronic storage is 100% secure and reliable, and we cannot
                guarantee its absolute security.
              </p>
              
              <p className="mt-8">
                <strong>This is a placeholder document. You should replace this with your actual Privacy Policy.</strong>
              </p>
            </div>
          </section>

          <section id="risk-disclosure">
            <h2 className="text-3xl font-semibold mb-6 border-b pb-3">Risk Disclosure</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Investing in digital assets involves significant risk. The value of digital assets can be highly volatile and is subject to wide fluctuations. You should be aware that you may lose all of your invested capital.
              </p>
              <p>
                You should not invest in digital assets if you do not have the necessary knowledge and expertise, do not understand their characteristics and do not understand the risks associated with them.
              </p>
              <p className="mt-8">
                <strong>This is a placeholder document. You should replace this with your actual Risk Disclosure.</strong>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LegalPage;
