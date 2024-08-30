import React from "react";
import styles from "./cardList.module.css";
import Card from "@/components/card/Card";


const CardList = ({ posts }) => {


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <div className={styles.posts}>
        {posts?.map((item) => (
          <Card item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default CardList;
