import Head from "next/head";
import { connectToDatabase } from "../util/mongodb";

import layoutStyles from "../styles/Layout.module.css";

export default function Home({ properties }) {
  return (
    <div className={layoutStyles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={layoutStyles.title}>Airbnb listings</h1>

        <div className={layoutStyles.smContainer}>
          {properties &&
            properties.map((property) => {
              return (
                <div key={property.id} className={layoutStyles.card}>
                  <div className={layoutStyles.cardHeader}>
                    <img src={property.image} />
                  </div>
                  <div className={layoutStyles.cardBody}>
                    <div className={layoutStyles.cardBodyTitle}>
                      <h3>{property.name}</h3>
                      <p>{property.address.street}</p>
                      <p className={layoutStyles.subText}>
                        ({property.guests} guests)
                      </p>
                    </div>

                    <p>${property.price}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      <footer>
        <p>Footer</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  const data = await db
    .collection("listingsAndReviews")
    .find({})
    .sort({ _id: 1 })
    .limit(20)
    .toArray();

  const properties = data.map((property) => {
    let price;
    price = JSON.parse(JSON.stringify(property.price));
    price = price.$numberDecimal;

    let cleaningFee = 0;
    if (property.cleaning_fee !== undefined) {
      cleaningFee = JSON.parse(JSON.stringify(property.cleaning_fee));
      cleaningFee = cleaningFee.$numberDecimal;
    }

    return {
      id: property._id,
      name: property.name,
      image: property.images.picture_url,
      address: property.address,
      guests: property.accommodates,
      price: price,
      cleaning_fee: cleaningFee,
    };
  });

  console.log(properties);
  return {
    props: { properties },
  };
}
