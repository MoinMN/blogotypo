const requestGoogleIndexing = async (blogUrl) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/googleIndexing/indexing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: blogUrl }),
    });

    const data = await response.json();
    console.log("Google Indexing Response:", data);
  } catch (error) {
    console.error("Failed to request indexing:", error);
  }
};


export default requestGoogleIndexing;