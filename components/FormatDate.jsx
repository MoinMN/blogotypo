
export const formatDateForBlog = (timestamp) => {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' }); // Get full month name
  const year = date.getFullYear();

  return `${formattedHours}:${minutes}${ampm}, ${day} ${month} ${year}`;
}


// format date to mintus, days, date, etc
export const formatDateForComment = (timestamp) => {
  const now = new Date();
  const postDate = new Date(timestamp);
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
    // Format the date as "YYYY-MM-DD" for posts older than 30 days
    return postDate.toISOString().split("T")[0];
  }
};

export const formatDateForAdmin = (timestamp) => {
  const date = new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, '0'); // 24-hour format
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
  const year = date.getFullYear();

  return `${hours}:${minutes}, ${day}/${month}/${year}`;
};
