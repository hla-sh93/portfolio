import { GlassCard } from "@/components/ui/GlassCard";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Mail, Trash } from "lucide-react";

export const metadata = { title: "Messages | Admin" };

export default async function AdminMessagesPage() {
  let messages: any[] = [];
  try {
    messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Database query failed, using mock data.", error);
    messages = [
      {
        id: "1",
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Project Inquiry",
        message: "Hi, I love your portfolio and would like to discuss a project.",
        createdAt: new Date(),
        read: false
      },
      {
        id: "2",
        name: "Acme Corp",
        email: "hello@acme.com",
        subject: "Collaboration",
        message: "We're looking for a UI designer for our new app.",
        createdAt: new Date(Date.now() - 86400000),
        read: true
      }
    ];
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Messages</h1>
        <p className="text-text-secondary mt-2">Contact form submissions.</p>
      </header>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <GlassCard padding="lg" className="text-center text-text-tertiary">
            No messages found.
          </GlassCard>
        ) : (
          messages.map((msg) => (
            <GlassCard key={msg.id} padding="lg" className={`relative transition-all ${!msg.read ? "border-accent/50 bg-accent/5" : ""}`}>
              {!msg.read && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  New
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${!msg.read ? "bg-accent/10 text-accent" : "bg-bg-elevated text-text-tertiary"}`}>
                  <Mail className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0 pr-16 md:pr-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className="font-bold text-text-primary text-lg truncate">
                      {msg.name} <span className="text-sm font-normal text-text-tertiary ml-2">&lt;{msg.email}&gt;</span>
                    </h3>
                    <span className="text-xs text-text-tertiary shrink-0">
                      {format(new Date(msg.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  
                  <div className="text-sm font-medium text-text-secondary mb-3">
                    Subject: {msg.subject}
                  </div>
                  
                  <div className="bg-bg-base/50 p-4 rounded-xl text-sm text-text-secondary leading-relaxed border border-border/50 whitespace-pre-wrap">
                    {msg.message}
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-3">
                    <button className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                      Mark as {msg.read ? "Unread" : "Read"}
                    </button>
                    <span className="text-border">|</span>
                    <button className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors flex items-center gap-1">
                      <Trash className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
