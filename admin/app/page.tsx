const stats = [
  { label: "New inquiries", value: "82", change: "+18% vs last week" },
  { label: "Confirmed orders", value: "27", change: "₹1.4 Cr pipeline" },
  { label: "Ready for dispatch", value: "11", change: "Avg 4.2 days" },
  { label: "Live collections", value: "36", change: "6 expiring soon" },
];

const inquiries = [
  {
    client: "Aisha Raina",
    collection: "Emerald Tides",
    budget: "₹14L",
    status: "Awaiting CAD",
  },
  {
    client: "Devika Bhat",
    collection: "Polki Couture",
    budget: "₹32L",
    status: "Virtual preview booked",
  },
  {
    client: "Riya & Kabir",
    collection: "Bridal Heritage",
    budget: "₹68L",
    status: "Deposit received",
  },
];

const pipeline = [
  { stage: "Design brief locked", owner: "Sanjana", eta: "Today" },
  { stage: "CAD + 360 renders", owner: "Arif", eta: "Tomorrow" },
  { stage: "Workshop casting", owner: "Master Ji", eta: "24 Nov" },
  { stage: "Polish & QA", owner: "Quality pod", eta: "28 Nov" },
];

const collections = [
  {
    name: "Bridal Polki 2025",
    fill: "78%",
    updates: "8 SKUs low on images",
  },
  {
    name: "Everyday Diamond Edge",
    fill: "62%",
    updates: "Need price sync",
  },
  {
    name: "Mens Heritage Capsule",
    fill: "44%",
    updates: "New lookbook pending",
  },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent text-white lg:flex-row">
      <aside className="hidden w-72 flex-col gap-8 border-white/5 bg-[#0b1f18]/80 px-6 py-8 backdrop-blur md:flex">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200/70">
            Aurum Command
          </p>
          <p className="text-2xl font-semibold text-amber-100">Admin Panel</p>
        </div>
        <nav className="space-y-4 text-sm">
          {[
            "Dashboard",
            "Collections",
            "Orders",
            "Clients",
            "Concierge",
            "Marketing",
            "Settings",
          ].map((item) => (
            <button
              key={item}
              className={`w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-left font-medium transition hover:border-amber-300/40 hover:text-amber-200 ${
                item === "Dashboard" ? "border-amber-300/60 text-amber-200" : ""
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-200/20 via-transparent to-transparent p-4 text-sm text-amber-100">
          <p className="text-xs uppercase tracking-widest text-amber-200/80">
            Concierge Load
          </p>
          <p className="text-3xl font-semibold">63%</p>
          <p className="text-xs text-amber-50/70">3 stylists online · 9 chats active</p>
        </div>
      </aside>

      <main className="flex-1 space-y-8 px-5 py-8 lg:px-10">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-amber-200">
              Thursday, 20 Nov
            </p>
            <h1 className="text-3xl font-semibold">Luxury Jewellery Command Centre</h1>
          </div>
          <div className="flex items-center gap-4">
            <input
              placeholder="Search SKU, client or order"
              className="w-64 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-amber-50 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
            />
            <button className="rounded-full border border-white/10 p-3 hover:border-amber-200/50">
              🔔
            </button>
            <div className="rounded-full border border-white/10 px-4 py-2 text-sm">
              Aria · Super Admin
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/5 bg-[#10261d]/80 p-5"
            >
              <p className="text-sm text-white/60">{stat.label}</p>
              <p className="text-4xl font-semibold text-amber-100">{stat.value}</p>
              <p className="text-xs text-amber-200/80">{stat.change}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-amber-100">
                Design & order pipeline
              </h2>
              <button className="text-sm text-amber-200">View board</button>
            </div>
            <div className="mt-6 space-y-4">
              {pipeline.map((entry, idx) => (
                <div
                  key={entry.stage}
                  className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[#132921]/70 px-4 py-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/50 text-sm text-amber-100">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{entry.stage}</p>
                    <p className="text-xs text-white/60">
                      Owner: {entry.owner} · ETA {entry.eta}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-200/20 px-3 py-1 text-xs text-amber-100">
                    Tracking
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-[#0c1f18]/80 p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-amber-100">
              Collection health
            </h2>
            <div className="mt-6 space-y-4">
              {collections.map((collection) => (
                <div key={collection.name} className="space-y-2 rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium">{collection.name}</p>
                    <span className="text-amber-200">{collection.fill}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-200 to-emerald-300"
                      style={{ width: collection.fill }}
                    />
                  </div>
                  <p className="text-xs text-white/60">{collection.updates}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-[#0f241c]/80 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-amber-100">Recent inquiries</h2>
            <button className="text-sm text-amber-200">Export</button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {inquiries.map((item) => (
              <div key={item.client} className="rounded-2xl bg-white/5 p-4">
                <p className="text-lg font-semibold text-amber-100">{item.client}</p>
                <p className="text-sm text-white/60">{item.collection}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>{item.budget}</span>
                  <span className="rounded-full bg-amber-200/20 px-3 py-1 text-xs text-amber-100">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-amber-100">
              Push announcement
            </h2>
            <p className="text-sm text-white/70">
              Alert retail clients across WhatsApp, push notifications and email.
            </p>
            <div className="mt-4 space-y-3">
              <input
                placeholder="Headline"
                className="w-full rounded-2xl border border-white/10 bg-[#07130f]/80 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
              />
              <textarea
                rows={3}
                placeholder="Message"
                className="w-full rounded-2xl border border-white/10 bg-[#07130f]/80 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
              />
              <button className="w-full rounded-2xl bg-gradient-to-r from-amber-200 to-emerald-300 py-3 text-center font-semibold text-emerald-950">
                Send broadcast
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/5 bg-[#0b1f18]/80 p-6">
            <h2 className="text-xl font-semibold text-amber-100">Team presence</h2>
            <div className="mt-4 space-y-3">
              {[
                { name: "Sanjana", role: "Lead stylist", status: "On chat" },
                { name: "Arif", role: "Head CAD", status: "Reviewing renders" },
                { name: "Yusuf", role: "Logistics", status: "Dispatch run" },
              ].map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-white/60">{member.role}</p>
                  </div>
                  <span className="text-xs text-amber-200">{member.status}</span>
                </div>
              ))}
            </div>
        </div>
        </section>
      </main>
    </div>
  );
}
