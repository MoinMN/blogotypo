const requestGoogleIndexing = async (blogUrl) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/googleIndexing/indexing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: blogUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Try getting the error message
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Google Indexing Response:", data);
    } else {
      throw new Error("Invalid JSON response from API");
    }

  } catch (error) {
    console.error("Failed to request indexing:", error);
  }
};

export default requestGoogleIndexing;
