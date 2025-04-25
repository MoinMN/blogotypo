export const formatDateForBlog = (timestamp) => {
  const istDate = new Date(
    new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const hours = istDate.getHours();
  const minutes = istDate.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;

  const day = istDate.getDate();
  const month = istDate.toLocaleString('default', { month: 'long' });
  const year = istDate.getFullYear();

  return `${formattedHours}:${minutes}${ampm}, ${day} ${month} ${year}`;
};

// format date to mintus, days, date, etc
export const formatDateForComment = (timestamp) => {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const postDate = new Date(
    new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return postDate.toISOString().split("T")[0];
  }
};

export const formatDateForAdmin = (timestamp) => {
  const istDate = new Date(
    new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const hours = istDate.getHours().toString().padStart(2, '0');
  const minutes = istDate.getMinutes().toString().padStart(2, '0');
  const day = istDate.getDate().toString().padStart(2, '0');
  const month = (istDate.getMonth() + 1).toString().padStart(2, '0');
  const year = istDate.getFullYear();

  return `${hours}:${minutes}, ${day}/${month}/${year}`;
};

