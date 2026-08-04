const newReviewTemplate = (
  authorName,
  reviewerName,
  blogTitle,
  review,
  rating,
  slug,
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Review on Your Blog</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #4c1d95;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }

        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #6b21a8;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0px 4px 10px rgba(0,0,0,.2);
        }

        .header {
          font-size: 30px;
          font-weight: bold;
          color: #e9d5ff;
          margin-bottom: 20px;
        }

        .content {
          font-size: 18px;
          line-height: 1.7;
          color: #f5f3ff;
        }

        .blog-title {
          background: #7e22ce;
          padding: 14px;
          border-radius: 6px;
          font-size: 20px;
          font-weight: bold;
          margin: 20px 0;
          color: #ffffff;
        }

        .review-box {
          background: #f3e8ff;
          color: #4c1d95;
          padding: 18px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: left;
        }

        .review-box h3 {
          margin-top: 0;
        }

        .stars {
          font-size: 22px;
          color: #f59e0b;
          margin-bottom: 10px;
        }

        .cta-button {
          display: inline-block;
          margin-top: 25px;
          padding: 14px 28px;
          background-color: #e9d5ff;
          color: #4c1d95;
          font-size: 18px;
          font-weight: bold;
          text-decoration: none;
          border-radius: 6px;
        }

        .footer {
          margin-top: 25px;
          font-size: 14px;
          color: #f3e8ff;
        }
      </style>
    </head>

    <body>

      <div class="email-container">

        <div class="header">
          💬 You Received a New Review!
        </div>

        <div class="content">

          <p>Hi <strong>${authorName}</strong>,</p>

          <p>
            <strong>${reviewerName}</strong> has reviewed your blog.
          </p>

          <div class="blog-title">
            📝 ${blogTitle}
          </div>

          <div class="review-box">

            <h3>Review</h3>

            <div class="stars">
              ${"⭐".repeat(rating)}
            </div>

            <p>
              "${review}"
            </p>

          </div>

          <a
            href="${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/blog/${slug}"
            class="cta-button"
          >
            Read Review
          </a>

          <p style="margin-top:25px">
            Thank you for being part of <strong>Blogotypo</strong>.
            Keep creating amazing content!
          </p>

        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} <strong>Blogotypo</strong>. All Rights Reserved.
        </div>

      </div>

    </body>
    </html>
  `;
};

export default newReviewTemplate;
