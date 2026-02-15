import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Download, 
  ExternalLink, 
  Search,
  GraduationCap,
  Award,
  BookOpen,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import axios from "axios";
import "@/App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [profile, setProfile] = useState(null);
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchPublications();
    fetchNews();
  }, []);

  useEffect(() => {
    filterPublications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publications, searchTerm, yearFilter, typeFilter]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchPublications = async () => {
    try {
      const response = await axios.get(`${API}/publications`);
      setPublications(response.data);
    } catch (error) {
      console.error("Error fetching publications:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API}/news`);
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const filterPublications = () => {
    let filtered = publications;

    if (searchTerm) {
      filtered = filtered.filter(pub =>
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.authors.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (yearFilter !== "all") {
      filtered = filtered.filter(pub => pub.year === parseInt(yearFilter));
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(pub => pub.type === typeFilter);
    }

    setFilteredPublications(filtered);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/contact`, contactForm);
      alert("Thank you for your message! I'll get back to you soon.");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Sorry, there was an error submitting your message. Please try again.");
    }
  };

  const downloadCV = () => {
    window.open(`${API}/cv`, '_blank');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const uniqueYears = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-app">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-nav border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-sm uppercase tracking-widest"
            >
              {profile.name.split(' ').slice(-1)[0]}
            </motion.div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8">
              {['about', 'research', 'publications', 'teaching', 'awards', 'news', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-sm font-mono uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                  data-testid={`nav-${item}`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 flex flex-col gap-4 pb-4"
            >
              {['about', 'research', 'publications', 'teaching', 'awards', 'news', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-sm font-mono uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors text-left"
                  data-testid={`mobile-nav-${item}`}
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-6" data-testid="hero-label">
                Research Associate
              </p>
              <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-8" data-testid="hero-name">
                {profile.name}
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-slate-600 mb-8" data-testid="hero-affiliation">
                {profile.affiliation}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={downloadCV}
                  className="bg-slate-900 text-white px-8 py-6 text-sm font-mono uppercase tracking-widest hover:bg-slate-800 transition-all duration-300 rounded-none"
                  data-testid="download-cv-button"
                >
                  <Download className="mr-2 h-4 w-4" /> Download CV
                </Button>
                <Button
                  onClick={() => scrollToSection('contact')}
                  variant="outline"
                  className="bg-transparent border border-slate-200 text-slate-900 px-8 py-6 text-sm font-mono uppercase tracking-widest hover:bg-slate-50 transition-all duration-300 rounded-none"
                  data-testid="contact-button"
                >
                  Get in Touch
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square overflow-hidden border border-slate-200">
                <img
                  src="https://github.com/sanjeev784/sanjeevghai.github.io/blob/10e3b5c9e3f986f0834a0d78f4e555fadff6288b/DSC_0129.JPG"
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  data-testid="hero-image"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-6" data-testid="about-label">
              About
            </p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-12" data-testid="about-heading">
              Background & Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <p className="text-base md:text-lg leading-relaxed text-slate-600 mb-6" data-testid="about-bio">
                  {profile.bio}
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4 text-[#8EE8D8]" />
                    <a href={`mailto:${profile.email}`} className="hover:text-slate-900 transition-colors" data-testid="email-link">
                      {profile.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-[#8EE8D8]" />
                    <span data-testid="phone-text">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-[#8EE8D8]" />
                    <span data-testid="address-text">{profile.address}</span>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1698226509825-3e0083e86f05?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjYW1icmlkZ2UlMjB1bml2ZXJzaXR5JTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc3MDc4MTg2Mnww&ixlib=rb-4.1.0&q=85"
                  alt="Cambridge University"
                  className="w-full h-64 object-cover border border-slate-200"
                  data-testid="cambridge-image"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Interests */}
      <section id="research" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-6" data-testid="research-label">
              Research
            </p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-12" data-testid="research-heading">
              Areas of Interest
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.research_interests.map((interest, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-50 p-8 border-l-2 border-[#8EE8D8] hover:border-[#00BDB6] transition-colors"
                  data-testid={`research-interest-${index}`}
                >
                  <p className="text-base font-medium">{interest}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Publications */}
      <section id="publications" className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-6" data-testid="publications-label">
              Publications
            </p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-12" data-testid="publications-heading">
              Research Output
            </h2>

            {/* Filters */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-none border-slate-200"
                  data-testid="publication-search-input"
                />
              </div>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="rounded-none border-slate-200" data-testid="year-filter-select">
                  <SelectValue placeholder="Filter by year" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="rounded-none border-slate-200" data-testid="type-filter-select">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="journal">Journal Articles</SelectItem>
                  <SelectItem value="conference">Conference Papers</SelectItem>
                  <SelectItem value="book_chapter">Book Chapters</SelectItem>
                  <SelectItem value="submitted">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Publications List */}
            <div className="space-y-6">
              {filteredPublications.map((pub, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-white p-8 border border-slate-100 hover:border-slate-300 transition-all duration-500 hover:shadow-lg group"
                  data-testid={`publication-${index}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-2">
                      <p className="text-sm font-mono uppercase tracking-widest text-[#8EE8D8]" data-testid={`publication-year-${index}`}>
                        {pub.year}
                      </p>
                    </div>
                    <div className="md:col-span-10">
                      <h3 className="text-xl md:text-2xl font-medium mb-3 group-hover:text-[#00BDB6] transition-colors" data-testid={`publication-title-${index}`}>
                        {pub.title}
                      </h3>
                      <p className="text-slate-600 mb-2" data-testid={`publication-authors-${index}`}>{pub.authors}</p>
                      {pub.journal && (
                        <p className="text-sm text-slate-500 italic mb-2" data-testid={`publication-journal-${index}`}>
                          {pub.journal}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono uppercase tracking-widest text-slate-400" data-testid={`publication-type-${index}`}>
                          {pub.type.replace('_', ' ')}
                        </span>
                        {pub.link && (
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono uppercase tracking-widest text-[#00BDB6] hover:text-[#8EE8D8] transition-colors flex items-center gap-1"
                            data-testid={`publication-link-${index}`}
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredPublications.length === 0 && (
              <p className="text-center text-slate-500 py-12" data-testid="no-publications-message">
                No publications found matching your criteria.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Teaching */}
      <section id="teaching" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-6" data-testid="teaching-label">
              Teaching
            </p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-12" data-testid="teaching-heading">
              Academic Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 border border-slate-100" data-testid="teaching-cambridge">
                <GraduationCap className="h-8 w-8 text-[#8EE8D8] mb-4" />
                <h3 className="text-xl md:text-2xl font-medium mb-4">University of Cambridge</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• IAP4 Mathematics supervisions at Lucy Cavendish (2025)</li>
                  <li>• Mathematics and Programming II</li>
                </ul>
              </div>
              <div className="bg-white p-8 border border-slate-100" data-testid="teaching-newcastle">
                <GraduationCap className="h-8 w-8 text-[#8EE8D8] mb-4" />
                <h3 className="text-xl md:text-2xl font-medium mb-4">Newcastle University</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• ENG1005: Thermofluid Mechanics Lab (2021)</li>
                  <li>• MEC8062: Turbulent Fluid Flow (2022)</li>
                  <li>• MEC3032: Advanced Thermofluid Dynamics (2023)</li>
                  <li>• MEC3028: Computational Heat & Fluid Flow (2023)</li>
                </ul>
              </div>
              <div className="bg-white p-8 border border-slate-100" data-testid="teaching-iit">
                <GraduationCap className="h-8 w-8 text-[#8EE8D8] mb-4" />
                <h3 className="text-xl md:text-2xl font-medium mb-4">IIT Kanpur</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• ME681A: Mathematical Methods in Engineering (2019)</li>
                  <li>• ME643A: Combustion and Environment (2016, 2017)</li>
                  <li>• ME647A: Introduction to Turbulence (2016)</li>
                  <li>• ME301A: Energy Systems I (2017, 2018)</li>
                  <li>• ME745A: Modeling of Turbulent Combustion (2018)</li>
                </ul>
              </div>
              <div className="bg-white p-8 border border-slate-100" data-testid="teaching-supervision">
                <BookOpen className="h-8 w-8 text-[#8EE8D8] mb-4" />
                <h3 className="text-xl md:text-2xl font-medium mb-4">Student Supervision</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Sudhakar Singh (MTech) - MMC simulations</li>
                  <li>• Rajat Gupta (MS) - Turbulent Lifted Flames</li>
                  <li>• Paranaya Keshari Nahak (MTech) - LES of DME Flame</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Awards */}
      <section id="awards" className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-6" data-testid="awards-label">
              Recognition
            </p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-12" data-testid="awards-heading">
              Awards & Honors
            </h2>
            <div className="space-y-6">
              {[
                { year: "2022", award: "2nd Prize - UKCTRF Audio-Visual Category", org: "UK Combustion and Turbulent Reacting Flow Conference" },
                { year: "2021", award: "Global Talent Endorsement", org: "UKRI (UK Research and Innovation)" },
                { year: "2018", award: "Travel Fellowship Award", org: "Combustion Institute, Pittsburgh, USA" },
                { year: "2014-2019", award: "MHRD Fellowship", org: "Ministry of Human Resource and Development, India" },
                { year: "2013", award: "Gold Medal - Bachelor's Degree", org: "Shaheed Udham Singh College of Engineering & Technology" },
                { year: "2013-2015", award: "GATE Qualifier (3 times)", org: "Graduate Aptitude Test for Engineers" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-8 border-l-4 border-[#8EE8D8] hover:border-[#00BDB6] transition-colors"
                  data-testid={`award-${index}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-2">
                      <p className="text-sm font-mono uppercase tracking-widest text-[#8EE8D8]" data-testid={`award-year-${index}`}>
                        {item.year}
                      </p>
                    </div>
                    <div className="md:col-span-10">
                      <h3 className="text-xl md:text-2xl font-medium mb-2" data-testid={`award-title-${index}`}>{item.award}</h3>
                      <p className="text-slate-600" data-testid={`award-org-${index}`}>{item.org}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-6" data-testid="news-label">
              Updates
            </p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-12" data-testid="news-heading">
              Recent News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-50 p-8 border border-slate-100 hover:border-[#8EE8D8] transition-colors"
                  data-testid={`news-item-${index}`}
                >
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3" data-testid={`news-date-${index}`}>
                    {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h3 className="text-xl font-medium mb-3" data-testid={`news-title-${index}`}>{item.title}</h3>
                  <p className="text-slate-600" data-testid={`news-content-${index}`}>{item.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-6" data-testid="contact-label">
              Contact
            </p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-12" data-testid="contact-heading">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-base md:text-lg leading-relaxed text-slate-600 mb-8" data-testid="contact-description">
                  I'm always interested in hearing about new research collaborations, speaking opportunities, or consulting projects. Feel free to reach out!
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-[#8EE8D8] mt-1" />
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <a href={`mailto:${profile.email}`} className="text-slate-600 hover:text-[#00BDB6] transition-colors" data-testid="contact-email">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-[#8EE8D8] mt-1" />
                    <div>
                      <p className="font-medium mb-1">Phone</p>
                      <p className="text-slate-600" data-testid="contact-phone">{profile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-[#8EE8D8] mt-1" />
                    <div>
                      <p className="font-medium mb-1">Address</p>
                      <p className="text-slate-600" data-testid="contact-address">{profile.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="rounded-none border-slate-200"
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="rounded-none border-slate-200"
                    data-testid="contact-email-input"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                    className="rounded-none border-slate-200"
                    data-testid="contact-subject-input"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    rows={6}
                    className="rounded-none border-slate-200"
                    data-testid="contact-message-textarea"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-slate-900 text-white px-8 py-6 text-sm font-mono uppercase tracking-widest hover:bg-slate-800 transition-all duration-300 rounded-none"
                  data-testid="contact-submit-button"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-500" data-testid="footer-copyright">
              © {new Date().getFullYear()} {profile.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-900 transition-colors" data-testid="footer-google-scholar">
                Google Scholar
              </a>
              <a href="https://researchgate.net" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-900 transition-colors" data-testid="footer-researchgate">
                ResearchGate
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
