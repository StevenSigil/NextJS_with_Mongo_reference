// Returns a list of 20 entries

// Use Fetch/Async/Axios to query this route

import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const entries = await db
    .collection("listingsAndReviews")
    .find({})
    .sort({ accommodates: -1 })
    .limit(20)
    .toArray();

  res.json(entries);
};
