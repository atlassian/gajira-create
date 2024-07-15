module.exports = class AgileClient {
  constructor(baseUrl, token, email) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.email = email;
  }

  async #callBoardEndpoint(boardId, queryParams = "") {
    return (
      await fetch(
        `${this.baseUrl}/rest/agile/1.0/board/${boardId}/sprint${queryParams}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.email}:${this.token}`
            ).toString("base64")}`,
            Accept: "application/json",
          },
          credentials: "include",
        }
      )
    ).json();
  }

  async getActiveSprint(boardId) {
    const searchParams = new URLSearchParams({
      state: "active",
    });
    const activeSprints = await this.#callBoardEndpoint(
      boardId,
      `?${searchParams.toString()}`
    );

    return activeSprints.values.slice(-1)[0];
  }
}
