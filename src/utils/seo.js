export const getBreadcrumbs = (postData) => {  
  
    const breadcrumbs = [
        { name: "Home", url: `${process.env.NEXT_PUBLIC_SITE_URL}` },
        { name: postData.catSlug, url: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${postData.catSlug}` }, 
        { name: postData.title, url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${postData.slug}` }, 
    ];

    return breadcrumbs;
};


export const getPostMetadata = (postData) => {
    const publishedAt = new Date(postData.createdAt).toISOString();
    const modifiedAt = new Date(postData.updatedAt || postData.createdAt).toISOString();

    const ogImages = postData.img ? [{ url: postData.img }] : [];
    const authors = postData.user?.name ? [postData.user.name] : [];

    const keywordsArray = [
        postData?.keywords,
        postData?.title,
        postData?.catSlug,
        postData?.user.name,
        "CollabChron",
    ];
    const keywords = keywordsArray.join(", ");

    const breadcrumbs = getBreadcrumbs(postData); // Get dynamic breadcrumb data

    return {
        title: postData.title,
        description: postData.postDesc,
        keywords,
        robots: "index, follow",
        openGraph: {
            title: postData.title,
            description: postData.postDesc,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${postData.slug}`,
            type: "article",
            publishedTime: publishedAt,
            modifiedTime: modifiedAt,
            images: ogImages,
            authors,
        },
        twitter: {
            card: "summary_large_image",
            title: postData.title,
            description: postData.postDesc,
            images: ogImages,
        },
        alternates: {
            types: {
                "application/rss+xml": `${process.env.NEXT_PUBLIC_SITE_URL}/routes/rss`,
            },
        },
        author: postData.user?.name || "Chinonso Chikelue (fluantiX)",
        breadcrumbs, // Include breadcrumbs here
    };
};


export const generateJSONLD = (postData) => {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${postData.slug}`;
    const imgUrl = postData.img || "";

    const breadcrumbs = getBreadcrumbs(postData); // Get dynamic breadcrumb data

    // Structure breadcrumbs in JSON-LD format
    const breadcrumbList = breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url,
    }));

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": url,
        "name": `${postData.title} - CollabChron`,
        "headline": postData.title,
        "description": postData.desc,
        "author": {
            "@type": "Person",
            "name": postData.user?.name || "Unknown",
            "@id": postData.user?.name || "Unknown",
        },
        "publisher": {
            "@type": "Organization",
            "name": "CollabChron",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
                "width": 600,
                "height": 60
            }
        },
        "image": {
            "@type": "ImageObject",
            "url": imgUrl,
            "@id": imgUrl,
            "height": "362",
            "width": "388",
        },
        "datePublished": new Date(postData.createdAt).toISOString(),
        "dateModified": new Date(postData.updatedAt || postData.createdAt).toISOString(),
        "url": url,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        "keywords": [
            postData.keywords,
            postData.title,
            postData.catSlug,
            postData.user?.name,
            "CollabChron"
        ].filter(Boolean).join(", "),
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbList, // Include the breadcrumb list
        }
    };
};
