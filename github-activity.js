const fetchData = async (command) => {
  try {
    const res = await fetch(`https://api.github.com/users/${command}/events`);
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 404) {
        console.log('User not found');
      } else {
        console.log('An error occurred');
      }
      return;
    }

    if(data.length === 0) {
      console.log('user not found')
    }

    const pushRepo = data.filter((item) => item.type === "PushEvent");
    const createRepo = data.filter((item) => item.type === "CreateEvent");
    const deleteRepo = data.filter((item) => item.type === "DeleteEvent");
    const forkRepo = data.filter((item) => item.type === "ForkEvent");

    const repoPushCounts = {};
    const repoCreateDate = {};
    const repoDeleteCounts = {};
    const repoForkCounts = {};

    deleteRepo.forEach((item) => {
      const repoName = item.repo.name;
      const createdAt = new Date(item.created_at).toISOString();
      if (
        !repoCreateDate[repoName] ||
        new Date(createdAt) > new Date(repoCreateDate[repoName])
      ) {
        repoCreateDate[repoName] = createdAt;
      }
    });

    forkRepo.forEach((item) => {
      const repoName = item.repo.name;
      const createdAt = new Date(item.created_at).toISOString();
      if (
        !repoCreateDate[repoName] ||
        new Date(createdAt) > new Date(repoCreateDate[repoName])
      ) {
        repoCreateDate[repoName] = createdAt;
      }
    });

    createRepo.forEach((item) => {
      const repoName = item.repo.name;
      const createdAt = new Date(item.created_at).toISOString();

      if (
        !repoCreateDate[repoName] ||
        new Date(createdAt) > new Date(repoCreateDate[repoName])
      ) {
        repoCreateDate[repoName] = createdAt;
      }
    });

    pushRepo.forEach((item) => {
      const repoName = item.repo.name;
      const pushed = item.payload.commits.length;

      if (repoPushCounts[repoName]) {
        repoPushCounts[repoName] += pushed;
      } else {
        repoPushCounts[repoName] = pushed;
      }
    });

    Object.entries(repoDeleteCounts).forEach(([repo, deleted]) => {
      console.log(`Deleted ${deleted} times on ${repo}`);
    });

    Object.entries(repoForkCounts).forEach(([repo, forked]) => {
      console.log(`Forked ${forked} times on ${repo}`);
    });

    Object.entries(repoCreateDate).forEach(([repo, createdAt]) => {
      console.log(`Created at ${createdAt} on ${repo}`);
    });

    Object.entries(repoPushCounts).forEach(([repo, totalPushed]) => {
      console.log(`Pushed ${totalPushed} to ${repo}`);
    });

    return data;
  } catch (err) {
    console.err(err);
  }
};

const args = process.argv.slice(2);
const command = args[0];

fetchData(command);
