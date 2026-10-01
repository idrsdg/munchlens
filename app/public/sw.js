// MunchLens Service Worker

self.addEventListener("push", function (event) {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "MunchLens", body: event.data.text() };
  }

  const options = {
    body: payload.body || "",
    icon: "/icon.png",
    badge: "/icon.png",
    data: { url: payload.url || "/dashboard" },
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "MunchLens", options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
