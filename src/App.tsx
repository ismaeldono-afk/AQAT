import React, { useState } from 'react';
import { Eye, MapPin, Target, Users, Leaf, Tent, Building, Download, ArrowDown, ArrowUp, CheckSquare, LayoutDashboard, FileText, Settings as SettingsIcon, LogOut, Activity, Database } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [adminSection, setAdminSection] = useState<'dashboard' | 'content'>('dashboard');

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex font-sans">
        {/* Sidebar */}
        <div className="w-64 bg-[#1a2d1f] text-white flex flex-col shrink-0">
          <div className="p-6 border-b border-[#2a4d34]">
            <h2 className="text-xl font-bold">System Admin</h2>
            <p className="text-xs text-[#e6c770] mt-1">Meptain Agriculture</p>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button onClick={() => setAdminSection('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${adminSection === 'dashboard' ? 'bg-[#2a4d34] text-white' : 'text-gray-300 hover:bg-[#2a4d34] hover:text-white'}`}><LayoutDashboard size={18}/> Dashboard</button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2a4d34] rounded-lg text-left text-gray-300 hover:text-white transition-colors"><Users size={18}/> Members</button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2a4d34] rounded-lg text-left text-gray-300 hover:text-white transition-colors"><FileText size={18}/> Form Submissions</button>
            <button onClick={() => setAdminSection('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${adminSection === 'content' ? 'bg-[#2a4d34] text-white' : 'text-gray-300 hover:bg-[#2a4d34] hover:text-white'}`}><Database size={18}/> Content Management</button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2a4d34] rounded-lg text-left text-gray-300 hover:text-white transition-colors"><SettingsIcon size={18}/> Settings</button>
          </nav>
          <div className="p-4 border-t border-[#2a4d34]">
            <button onClick={() => setView('public')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2a4d34] rounded-lg text-left text-[#e6c770] transition-colors">
              <LogOut size={18}/> Return to Site
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-gray-800">{adminSection === 'dashboard' ? 'Dashboard Overview' : 'Content Management'}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">Admin User</span>
              <div className="w-10 h-10 bg-[#2a4d34] rounded-full flex items-center justify-center text-white font-bold shadow-sm">A</div>
            </div>
          </header>
          
          <main className="p-8 flex-1 overflow-y-auto">
            {adminSection === 'dashboard' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1 font-medium">Total Cooperative Members</p>
                        <h3 className="text-3xl font-bold text-gray-800">1,248</h3>
                      </div>
                      <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Users size={24}/></div>
                    </div>
                    <p className="text-sm text-green-600 mt-4 flex items-center gap-1 font-medium"><ArrowUp size={14}/> +12% this month</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1 font-medium">Pending Form Approvals</p>
                        <h3 className="text-3xl font-bold text-gray-800">42</h3>
                      </div>
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><FileText size={24}/></div>
                    </div>
                    <p className="text-sm text-orange-600 mt-4 font-medium">Needs attention</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1 font-medium">Active Programmes</p>
                        <h3 className="text-3xl font-bold text-gray-800">4</h3>
                      </div>
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Activity size={24}/></div>
                    </div>
                    <p className="text-sm text-blue-600 mt-4 flex items-center gap-1 font-medium"><CheckSquare size={14}/> All systems nominal</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Recent Form Submissions</h3>
                    <button className="text-sm text-[#2a4d34] font-medium hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                          <th className="px-6 py-4 font-medium">Form Type</th>
                          <th className="px-6 py-4 font-medium">Submitted By</th>
                          <th className="px-6 py-4 font-medium">Date</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">Membership Registration</td>
                          <td className="px-6 py-4 text-sm text-gray-600">John Doe (Yawan Village)</td>
                          <td className="px-6 py-4 text-sm text-gray-600">Today, 09:24 AM</td>
                          <td className="px-6 py-4"><span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs rounded-full font-medium border border-orange-100">Pending</span></td>
                          <td className="px-6 py-4"><button className="text-sm text-[#2a4d34] font-bold hover:underline">Review</button></td>
                        </tr>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">Coffee Delivery</td>
                          <td className="px-6 py-4 text-sm text-gray-600">Sarah Smith (Ward One)</td>
                          <td className="px-6 py-4 text-sm text-gray-600">Yesterday, 14:30 PM</td>
                          <td className="px-6 py-4"><span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-100">Approved</span></td>
                          <td className="px-6 py-4"><button className="text-sm text-[#2a4d34] font-bold hover:underline">View</button></td>
                        </tr>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">Land Consent</td>
                          <td className="px-6 py-4 text-sm text-gray-600">Village Elder Council</td>
                          <td className="px-6 py-4 text-sm text-gray-600">Oct 12, 2026</td>
                          <td className="px-6 py-4"><span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-100">Approved</span></td>
                          <td className="px-6 py-4"><button className="text-sm text-[#2a4d34] font-bold hover:underline">View</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-800">Public Site Content</h3>
                  <button className="px-4 py-2 bg-[#2a4d34] text-white rounded-lg text-sm font-medium hover:bg-[#1a2d1f] transition-colors">Save Changes</button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2a4d34] focus:border-transparent outline-none" defaultValue="Empowering Rural Communities" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                    <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2a4d34] focus:border-transparent outline-none h-24" defaultValue="Sustainable agriculture, conservation, tourism, and community development working together to create resilient livelihoods in rural Papua New Guinea." />
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-4">About Us Section</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">About Title</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2a4d34] focus:border-transparent outline-none" defaultValue="Rooted in Yawan Village" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">About Description</label>
                        <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2a4d34] focus:border-transparent outline-none h-24" defaultValue="Meptain Agriculture is a rural-based cooperative initiative rooted in Yawan Village, Kabwum District. We empower communities through sustainable agriculture, conservation, and development while creating pathways to prosperity for rural families." />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F3] font-serif text-[#333]">
      {/* Header */}
      <header className="bg-[#2a4d34] text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#F9F8F3] rounded-full flex flex-col items-center justify-center text-[#2a4d34] font-sans font-bold leading-none p-1 text-center">
              <span className="text-[10px]">MEPTAIN</span>
              <span className="text-[8px]">AGRICULTURE</span>
            </div>
            <div className="text-[10px] font-sans opacity-90 leading-tight">
              <p className="font-bold text-xs mb-1 tracking-wider">MEPTAIN AGRICULTURE</p>
              <p>P.O. BOX 503, Lae 411, Morobe Province, PNG</p>
              <p>Phone: 7573 9086</p>
              <p>Email: meptainagri@gmail.com</p>
            </div>
          </div>
          <nav className="flex gap-6 font-sans text-sm font-semibold tracking-wide">
            <a href="#" className="hover:text-[#e6c770] transition-colors">Home</a>
            <a href="#" className="hover:text-[#e6c770] transition-colors">About Us</a>
            <a href="#" className="hover:text-[#e6c770] transition-colors">Our Focus</a>
            <a href="#" className="hover:text-[#e6c770] transition-colors">Our Programmes</a>
            <a href="#" className="hover:text-[#e6c770] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 bg-[#1a2d1f]">
          <img 
            src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80" 
            alt="Aerial forest" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <p className="text-[#e6c770] font-sans text-xs font-bold tracking-[0.2em] mb-4 uppercase">
              Yawan Village • Kabwum District • Morobe Province
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Empowering <br/>Rural Communities
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              Sustainable agriculture, conservation, tourism, and community development working together to create resilient livelihoods in rural Papua New Guinea.
            </p>
            <button className="bg-[#e6c770] text-[#1a2d1f] font-sans font-bold px-6 py-3 text-sm tracking-wide hover:bg-white transition-colors flex items-center gap-2">
              Explore our work <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* WHO WE ARE Section */}
      <section className="py-20 px-6 max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#666] uppercase mb-3">Who We Are</p>
          <h2 className="text-3xl font-bold text-[#1a2d1f] mb-6">Rooted in Yawan Village</h2>
          <p className="max-w-3xl mx-auto text-lg text-[#444] leading-relaxed">
            Meptain Agriculture is a rural-based cooperative initiative rooted in Yawan Village, Kabwum District. We empower communities through sustainable agriculture, conservation, and development while creating pathways to prosperity for rural families.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#F9F8F3] border border-[#d3d9d3] p-8">
            <Eye className="text-[#4a6b52] mb-6" size={24} />
            <h3 className="text-xl font-bold text-[#1a2d1f] mb-4">Our Vision</h3>
            <p className="text-[#555] leading-relaxed">
              A thriving, self-reliant community where agriculture, conservation, and tourism drive sustainable livelihoods and development.
            </p>
          </div>
          <div className="bg-[#F9F8F3] border border-[#d3d9d3] p-8">
            <MapPin className="text-[#4a6b52] mb-6" size={24} />
            <h3 className="text-xl font-bold text-[#1a2d1f] mb-4">Our Location</h3>
            <p className="text-[#555] leading-relaxed">
              Yawan Village, Ward One, YUS LLG, Kabwum District, Morobe Province, Papua New Guinea.
            </p>
          </div>
          <div className="bg-[#F9F8F3] border border-[#d3d9d3] p-8">
            <Target className="text-[#4a6b52] mb-6" size={24} />
            <h3 className="text-xl font-bold text-[#1a2d1f] mb-4">Our Mission</h3>
            <p className="text-[#555] leading-relaxed">
              To strengthen rural communities through innovative agricultural practices, wildlife management, eco-tourism, and community-driven development.
            </p>
          </div>
        </div>
      </section>

      {/* OUR APPROACH Section */}
      <section className="py-20 px-6 max-w-[1200px] mx-auto border-t border-[#e2e6e2]">
        <div className="text-center mb-12">
          <p className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#666] uppercase mb-3">Our Approach</p>
          <h2 className="text-3xl font-bold text-[#1a2d1f] mb-6">Our Strategic Focus Areas</h2>
          <p className="max-w-2xl mx-auto text-lg text-[#444] leading-relaxed">
            Five connected strategies guide our work and help communities build resilience, protect biodiversity, and grow local opportunity.
          </p>
        </div>

        {/* Agribusiness Profile Box */}
        <div className="bg-white border-2 border-[#e6c770] p-8 md:p-10 mb-6 relative">
          <div className="absolute top-0 right-0 bg-[#e6c770] text-[#1a2d1f] font-sans text-[10px] font-bold px-4 py-1 rounded-bl-lg">
            Yawan Village - PNG
          </div>
          <div className="flex items-center gap-3 mb-6 border-b border-[#eee] pb-4">
            <div className="w-10 h-10 bg-[#e6c770] flex items-center justify-center rounded-sm">
              <Leaf className="text-[#1a2d1f]" size={20} />
            </div>
            <div>
              <p className="font-sans text-[10px] font-bold tracking-widest text-[#666] uppercase">Agribusiness Profile • 2027-2029</p>
              <h3 className="text-2xl font-bold text-[#1a2d1f]">Livelihood</h3>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 text-[13px] text-[#444] leading-[1.8] text-justify">
            <div>
              <p>
                <span className="float-left text-5xl font-bold leading-none pr-2 pt-1 text-[#2a4d34]">M</span>EPTAIN Agri-Business Trading operates from Yawan Village, YUS LLG, Kabwum District, Morobe Province, PNG, with a three-year strategic plan for 2027-2029. Its vision is to become Kabwum District's leading community-based agribusiness, connecting Yawan farmers to national and regional markets. Its mission is to buy, process, and market agricultural products—especially parchment coffee—through transparent farmer-centred purchasing, reliable logistics, and value-adding retail. The business combines agricultural retail and wholesale sales with parchment-coffee buying from local farmers. Revenue comes from local shop and market sales, Lae wholesale buyers, value-added coffee and packaged goods, seasonal contracts, coffee quality premiums, and collection or processing services.
              </p>
              <p className="mt-4">
                Major costs include farmer and supplier purchases, staff, storage, packaging, processing, marketing, administration, and transport. The primary market route is air freight from Yawan Airstrip through Nadzab to Lae: K8,000 to Nadzab plus K500 onward, or an estimated K8,500 per shipment. A 12-shipment baseline equals K102,000 annually, with local collection estimated at K1,500-K6,000 and storage and handling at K6,000-K12,000. Baseline retail estimates are K250,000 revenue, K120,000 COGS, K102,000 air freight, K6,000 local transport, K8,000 storage and packaging, K18,000 staff and administration, and K10,000 other operating costs, producing an estimated K-14,000 annual net before tax. Baseline parchment-coffee estimates are K180,000 revenue, K110,000 farmer purchases, K102,000 freight, K6,000 processing and packaging,
              </p>
            </div>
            <div>
              <p>
                and K5,000 collection, producing an estimated K-43,000 annual net before tax. These shortfalls show that consolidation, larger loads, lower freight rates, higher margins, local-market sales, and local value-adding are essential. Typical coffee shipments are 1,000-2,000 kg; the baseline is 12,000 kg annually at 1,000 kg per shipment.
              </p>
              <p className="mt-4">
                Recommendations include combining products, negotiating group or seasonal freight rates, shifting low-margin goods to local markets, investing in cleaning, grading, roasting and packaging, securing farmer and buyer contracts, and exploring sea or road alternatives. In 2027, MEPTAIN will register the business, establish shop and storage, pilot six coffee shipments, track full costs, test consolidation, and train farmers in quality. In 2028, it will scale to 8-12 larger consolidated shipments, invest in solar dryers and grading tools, build Lae buyer relationships, and launch basic branded packaging.
              </p>
              <p className="mt-4">
                In 2029, it will target profitability, formalize farmer and buyer contracts, diversify retail lines, and measure changes in farmer incomes. Key risks—freight costs, coffee price volatility, variable quality, cashflow constraints, and weather or airstrip disruption—will be managed through consolidation, forward contracts, quality control, working-capital buffers, staggered purchases, contingency stock, and flexible schedules. Financial figures are illustrative; precise forecasts require actual volumes, prices, freight quotes, and a detailed cashflow model. Immediate next steps are to confirm volumes and prices, obtain freight quotes, run a three-year projection, and complete a six-month pilot.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#F9F8F3] border border-[#d3d9d3] p-6 text-center hover:bg-white transition-colors">
            <Users className="mx-auto text-[#4a6b52] mb-4" size={24} />
            <h4 className="font-bold text-[#1a2d1f] mb-3 leading-tight">Community<br/>Management</h4>
            <p className="text-xs text-[#555] leading-relaxed">
              Strengthening governance, accountability, and cooperative leadership structures.
            </p>
          </div>
          <div className="bg-[#F9F8F3] border border-[#d3d9d3] p-6 text-center hover:bg-white transition-colors">
            <Leaf className="mx-auto text-[#4a6b52] mb-4" size={24} />
            <h4 className="font-bold text-[#1a2d1f] mb-3 leading-tight">Wildlife<br/>Management</h4>
            <p className="text-xs text-[#555] leading-relaxed">
              Protecting forests, rivers, and biodiversity through conservation programmes.
            </p>
          </div>
          <div className="bg-[#F9F8F3] border border-[#d3d9d3] p-6 text-center hover:bg-white transition-colors">
            <Tent className="mx-auto text-[#4a6b52] mb-4" size={24} />
            <h4 className="font-bold text-[#1a2d1f] mb-3 leading-tight">Tourism</h4>
            <p className="text-xs text-[#555] leading-relaxed">
              Promoting eco-tourism and cultural heritage to generate local income.
            </p>
          </div>
          <div className="bg-[#F9F8F3] border border-[#d3d9d3] p-6 text-center hover:bg-white transition-colors">
            <Building className="mx-auto text-[#4a6b52] mb-4" size={24} />
            <h4 className="font-bold text-[#1a2d1f] mb-3 leading-tight">Community<br/>Development</h4>
            <p className="text-[11px] text-[#555] leading-relaxed">
              Investing in education, health services, and infrastructure for long-term growth, including a partnership with Western Sydney University and support for the Nungon Grammar workbook, "Noniwin Maa Nongoruno", by Dr. Hannah Sarvasy and Mr. Ali Dono.
            </p>
          </div>
        </div>
      </section>

      {/* PRACTICAL ACTION Section */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto border-t border-[#e2e6e2]">
        <div className="text-center mb-12">
          <p className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#666] uppercase mb-3">Practical Action</p>
          <h2 className="text-3xl font-bold text-[#1a2d1f] mb-6">Our Programmes & Activities</h2>
          <p className="max-w-2xl mx-auto text-lg text-[#444] leading-relaxed">
            Our programmes connect sustainable land use with practical services, cultural pride, and locally led development.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 items-stretch">
          
          {/* Col 1 */}
          <div className="bg-white border border-[#d3d9d3] flex flex-col h-full">
            <img src="https://images.unsplash.com/photo-1587049352847-81a56d773c1c?auto=format&fit=crop&q=80" alt="Agriculture" className="w-full h-48 object-cover" />
            <div className="p-6 flex-grow">
              <h4 className="font-bold text-[#1a2d1f] text-lg mb-3">Agriculture &<br/>Livelihoods</h4>
              <p className="text-sm text-[#555] leading-relaxed">
                Coffee, cocoa, and food crop initiatives designed to improve household income.
              </p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="bg-white border border-[#d3d9d3] flex flex-col h-full">
            <img src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80" alt="Wildlife" className="w-full h-48 object-cover" />
            <div className="p-6 flex-grow">
              <h4 className="font-bold text-[#1a2d1f] text-lg mb-3">Wildlife & Conservation</h4>
              <p className="text-sm text-[#555] leading-relaxed">
                Awareness campaigns, reforestation, and sustainable resource use for a healthy environment.
              </p>
            </div>
          </div>

          {/* Col 3 */}
          <div className="bg-white border border-[#d3d9d3] flex flex-col h-full relative">
            <img src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80" alt="Eco-Tourism" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h4 className="font-bold text-[#1a2d1f] text-lg mb-3">Eco-Tourism</h4>
              <p className="text-sm text-[#555] leading-relaxed mb-6">
                Eco-trails, cultural showcases, and village-based visitor experiences.
              </p>
            </div>
            
            {/* Overlapping Downloadable Forms Section */}
            <div className="bg-[#F9F8F3] border-t border-[#d3d9d3] p-6 flex-grow">
              <p className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#666] uppercase mb-2">Resources</p>
              <h4 className="font-bold text-[#1a2d1f] text-xl mb-3">Downloadable<br/>Forms</h4>
              <p className="text-xs text-[#555] leading-relaxed mb-6">
                Download practical templates for cooperative membership, land consent, and PACD tool tracking.
              </p>
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col gap-2">
                  <div className="bg-white border border-[#d3d9d3] p-2 flex justify-center"><Download size={16} className="text-[#4a6b52]"/></div>
                  <p className="text-[10px] font-bold leading-tight">Mem<br/>Regi</p>
                  <p className="text-[9px] text-[#666] leading-tight flex-grow">A simple form to grow register for share Mept Agric Coop.</p>
                  <button className="bg-[#e6c770] text-[#1a2d1f] text-[9px] font-sans font-bold py-1 w-full text-center">Down</button>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-white border border-[#d3d9d3] p-2 flex justify-center"><Download size={16} className="text-[#4a6b52]"/></div>
                  <p className="text-[10px] font-bold leading-tight">Land<br/>Cons</p>
                  <p className="text-[9px] text-[#666] leading-tight flex-grow">Record written consent for storage and proce site.</p>
                  <button className="bg-[#e6c770] text-[#1a2d1f] text-[9px] font-sans font-bold py-1 w-full text-center">Down</button>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-white border border-[#d3d9d3] p-2 flex justify-center"><Download size={16} className="text-[#4a6b52]"/></div>
                  <p className="text-[10px] font-bold leading-tight">Tool<br/>Issue<br/>Reco</p>
                  <p className="text-[9px] text-[#666] leading-tight flex-grow">Track PACD tools issued to growers and their return condit.</p>
                  <button className="bg-[#e6c770] text-[#1a2d1f] text-[9px] font-sans font-bold py-1 w-full text-center">Down</button>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-white border border-[#d3d9d3] p-2 flex justify-center"><Download size={16} className="text-[#4a6b52]"/></div>
                  <p className="text-[10px] font-bold leading-tight">Coffee<br/>Deliver<br/>&amp; Purcha</p>
                  <p className="text-[9px] text-[#666] leading-tight flex-grow">Record coffee deliveries, quality, quantities, prices, and purchase details.</p>
                  <button className="bg-[#e6c770] text-[#1a2d1f] text-[9px] font-sans font-bold py-1 w-full text-center">Down</button>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4 */}
          <div className="bg-white border border-[#d3d9d3] flex flex-col h-full">
            <img src="https://images.unsplash.com/photo-1529156069898-49953eb1f5ff?auto=format&fit=crop&q=80" alt="Community" className="w-full h-48 object-cover" />
            <div className="p-6 flex-grow">
              <h4 className="font-bold text-[#1a2d1f] text-lg mb-3">Community<br/>Development</h4>
              <p className="text-xs text-[#555] leading-[1.6]">
                We collaborate with Western Sydney University to support education, community development, and research connected to the Nungon language and local knowledge. The project <em>A Grammar of Nungon: A Papuan language of northeast New Guinea</em> documents an important part of Papua New Guinea's linguistic and biocultural heritage. Research across Papua New Guinea shows that indigenous-language fluency and ethnobiological knowledge are declining together, making language documentation, intergenerational learning, and community-led education especially important. Our work helps celebrate Nungon language, culture, and knowledge while supporting practical opportunities for rural families.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-6 bg-[#edf0ed] border border-[#d3d9d3] p-6 flex items-start gap-4">
          <CheckSquare className="text-[#4a6b52] shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-[#1a2d1f] text-lg mb-1">Cooperative Management</h4>
            <p className="text-sm text-[#555]">
              Transparent cooperative governance and capacity-building workshops help local leaders manage programmes, partnerships, and community resources responsibly.
            </p>
          </div>
        </div>
      </section>

      {/* LOOKING AHEAD Section */}
      <section className="bg-[#2a4d34] text-white py-16 px-6">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80" 
              alt="Forest looking up" 
              className="w-full max-w-md h-auto object-cover grayscale opacity-80"
            />
          </div>
          <div>
            <p className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#e6c770] uppercase mb-3">Looking Ahead</p>
            <h2 className="text-3xl font-bold mb-8">Our Impact Goals</h2>
            <ul className="space-y-6 text-[#e2e6e2] font-sans">
              <li className="flex gap-4">
                <span className="w-1.5 h-1.5 bg-[#e6c770] rounded-full mt-2 shrink-0"></span>
                <p>Increase household income through sustainable farming.</p>
              </li>
              <li className="flex gap-4">
                <span className="w-1.5 h-1.5 bg-[#e6c770] rounded-full mt-2 shrink-0"></span>
                <p>Protect biodiversity and natural resources for future generations.</p>
              </li>
              <li className="flex gap-4">
                <span className="w-1.5 h-1.5 bg-[#e6c770] rounded-full mt-2 shrink-0"></span>
                <p>Strengthen community leadership and participation.</p>
              </li>
              <li className="flex gap-4">
                <span className="w-1.5 h-1.5 bg-[#e6c770] rounded-full mt-2 shrink-0"></span>
                <p>Create tourism opportunities that celebrate culture and environment.</p>
              </li>
              <li className="flex gap-4">
                <span className="w-1.5 h-1.5 bg-[#e6c770] rounded-full mt-2 shrink-0"></span>
                <p>Improve access to education, health, and infrastructure in rural areas.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2d1f] text-white py-16 px-6 font-sans">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 border-b border-[#2a4d34] pb-12 mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#e6c770] uppercase mb-4">Contact Us</p>
            <h3 className="font-serif text-2xl font-bold mb-6">Get in Touch with Meptain Agriculture</h3>
            <div className="text-sm text-white/80 space-y-4">
              <p>Base: Yawan Village, Ward One<br/>YUS LLG, Kabwum District<br/>Morobe Province, Papua New Guinea</p>
              <p>Phone: Cooperative Contact Number (insert here)</p>
              <p>Email: Cooperative Email (insert here)</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#e6c770] uppercase mb-4">Get Involved</p>
            <h3 className="font-serif text-2xl font-bold mb-6">Join us in making a difference</h3>
            <p className="text-sm text-white/80 mb-8 max-w-sm">
              Meptain Agriculture is building a stronger future with rural communities through practical action, shared learning, and care for land and culture.
            </p>
            <button className="bg-[#e6c770] text-[#1a2d1f] font-bold px-6 py-2.5 text-sm hover:bg-white transition-colors flex items-center gap-2" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
              Back to top <ArrowUp size={16} />
            </button>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
          <p>2026 Meptain Agriculture - Yawan Village, Morobe Province, PNG</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button onClick={() => setView('admin')} className="hover:text-white transition-colors underline">System Admin Login</button>
            <span>|</span>
            <button className="hover:text-white transition-colors flex items-center gap-1" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
              Return to top <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
