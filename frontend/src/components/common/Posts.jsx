import React from "react";
import Post from "./Post";

const Posts = () => {
  const posts = [
    {
      profile:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg",
      id: 1,
      username: "Subhransu",
      caption: "I am subhransu and this is my first post",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT09r2FPzuoBBpajGqns8yvraTL3HC_gdbNdlCs4D4CkiVXJ7VFsHPadaWm0OneSaIiksI&usqp=CAU",
    },
    {
      profile:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg",
      id: 2,
      username: "Lipsa",
      caption: "I am Lipsa and this is my first post ",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg",
    },
    {
      profile:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg",
      id: 3,
      username: "Kruhsna",
      caption: "I am krushna bf of lorensa ",
      imageUrl:
        "https://img.republicworld.com/tr:w-400,h-225,q-75,f-auto/all_images/gslxtatayaafnvo_16:9-1720694053147-16_9.webp",
    },
    {
      profile:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg",
      id: 4,
      username: "Lorensa",
      caption: "I am lorensa gf of krushna ",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT09r2FPzuoBBpajGqns8yvraTL3HC_gdbNdlCs4D4CkiVXJ7VFsHPadaWm0OneSaIiksI&usqp=CAU",
    },
    {
      profile:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg",
      id: 5,
      username: "Badal",
      caption: "I am badal bf of subhashree",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT09r2FPzuoBBpajGqns8yvraTL3HC_gdbNdlCs4D4CkiVXJ7VFsHPadaWm0OneSaIiksI&usqp=CAU",
    },
    {
      profile:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg",
      id: 6,
      username: "Subhashree",
      caption: "I am Subhashree gf of badal",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT09r2FPzuoBBpajGqns8yvraTL3HC_gdbNdlCs4D4CkiVXJ7VFsHPadaWm0OneSaIiksI&usqp=CAU",
    },
  ];
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          username={post.username}
          imageUrl={post.imageUrl}
          profile={post.profile}
          caption={post.caption}
        />
      ))}
    </div>
  );
};

export default Posts;
