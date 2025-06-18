import { strapiApi } from "@/lib/strapi/client";
import { supabase } from "@/lib/supabase/client";
import { Content } from "@/types";

async function syncStrapiToSupabase() {
  if (!supabase) {
    console.log(
      "⚠️  Supabase is not configured. Skipping Strapi to Supabase sync."
    );
    return;
  }

  try {
    console.log("Starting Strapi to Supabase synchronization...");

    // Fetch all contents from Strapi
    const strapiResponse = await strapiApi.getContents();
    const strapiContents = strapiResponse.data.map((item: any) => ({
      id: item.id,
      title: item.attributes.title,
      description: item.attributes.description,
      created_at: item.attributes.createdAt,
      updated_at: item.attributes.updatedAt,
    }));

    // Fetch all contents from Supabase
    const { data: supabaseContents } = await supabase
      .from("contents")
      .select("*");

    // Find contents that exist in Strapi but not in Supabase
    const strapiIds = strapiContents.map((content) => content.id);
    const supabaseIds = supabaseContents?.map((content) => content.id) || [];
    const missingInSupabase = strapiContents.filter(
      (content) => !supabaseIds.includes(content.id)
    );

    // Insert missing contents to Supabase
    if (missingInSupabase.length > 0) {
      console.log(
        `Inserting ${missingInSupabase.length} contents to Supabase...`
      );
      const { error } = await supabase
        .from("contents")
        .insert(missingInSupabase);

      if (error) {
        console.error("Error inserting contents to Supabase:", error);
      } else {
        console.log("Successfully inserted contents to Supabase");
      }
    }

    // Update existing contents in Supabase if they're different
    const existingContents = strapiContents.filter((content) =>
      supabaseIds.includes(content.id)
    );
    for (const content of existingContents) {
      const supabaseContent = supabaseContents?.find(
        (sc) => sc.id === content.id
      );
      if (
        supabaseContent &&
        (supabaseContent.title !== content.title ||
          supabaseContent.description !== content.description)
      ) {
        console.log(`Updating content ${content.id} in Supabase...`);
        const { error } = await supabase
          .from("contents")
          .update({
            title: content.title,
            description: content.description,
            updated_at: content.updated_at,
          })
          .eq("id", content.id);

        if (error) {
          console.error(`Error updating content ${content.id}:`, error);
        }
      }
    }

    console.log("Strapi to Supabase synchronization completed!");
  } catch (error) {
    console.error("Error during synchronization:", error);
  }
}

async function syncSupabaseToStrapi() {
  if (!supabase) {
    console.log(
      "⚠️  Supabase is not configured. Skipping Supabase to Strapi sync."
    );
    return;
  }

  try {
    console.log("Starting Supabase to Strapi synchronization...");

    // Fetch all contents from Supabase
    const { data: supabaseContents } = await supabase
      .from("contents")
      .select("*");

    if (!supabaseContents) {
      console.log("No contents found in Supabase");
      return;
    }

    // Fetch all contents from Strapi
    const strapiResponse = await strapiApi.getContents();
    const strapiIds = strapiResponse.data.map((item: any) => item.id);

    // Find contents that exist in Supabase but not in Strapi
    const missingInStrapi = supabaseContents.filter(
      (content) => !strapiIds.includes(content.id)
    );

    // Insert missing contents to Strapi
    for (const content of missingInStrapi) {
      console.log(`Inserting content ${content.id} to Strapi...`);
      try {
        await strapiApi.createContent({
          title: content.title,
          description: content.description,
        });
      } catch (error) {
        console.error(
          `Error inserting content ${content.id} to Strapi:`,
          error
        );
      }
    }

    console.log("Supabase to Strapi synchronization completed!");
  } catch (error) {
    console.error("Error during synchronization:", error);
  }
}

// Main sync function
async function syncAll() {
  console.log("Starting bidirectional synchronization...");

  await syncStrapiToSupabase();
  await syncSupabaseToStrapi();

  console.log("Bidirectional synchronization completed!");
}

// Run sync if this script is executed directly
if (require.main === module) {
  syncAll().catch(console.error);
}

export { syncStrapiToSupabase, syncSupabaseToStrapi, syncAll };
