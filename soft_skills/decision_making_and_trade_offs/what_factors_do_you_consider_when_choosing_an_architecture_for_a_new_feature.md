Choosing architecture for a new feature requires balancing technical requirements, team capabilities, and business constraints. I evaluate six key factors: requirements, team, existing patterns, scalability, maintainability, and time.

First, I deeply understand the requirements—both functional and non-functional. What does the feature need to do? What are the performance requirements? What are the security and compliance requirements? What data needs to be stored and how will it be accessed? I map out the data flow, the user interactions, and the integration points with other systems. Architecture that doesn't meet the requirements is wrong, no matter how elegant.

Second, I consider the team. An architecture that the team can't implement and maintain is a liability. If the team is experienced with a particular pattern or technology, I favor that over a theoretically superior approach that the team would struggle with. I also consider team size—a complex architecture that requires a large team to maintain is inappropriate for a small team.

Third, I look at existing patterns in the codebase. Consistency has enormous value. If the rest of the application uses a repository pattern with a service layer, introducing a different pattern for one feature creates confusion and maintenance burden. I follow existing patterns unless there's a compelling reason to diverge, and if I do diverge, I document why.

Fourth, I consider scalability—but in proportion to actual needs. I don't design for 10 million users if we have 10,000. I design for current needs with the ability to scale later. This means choosing patterns that are easy to scale up (horizontal scaling, caching layers, database indexing) without prematurely implementing the scaling infrastructure.

Fifth, I evaluate maintainability. How easy will it be to modify this feature in 6 months? How easy is it for a new developer to understand? I favor simple, explicit architectures over clever, implicit ones. The best architecture is the one that a new team member can understand in an hour.

Finally, I consider time constraints. If we need to ship in two weeks, I choose a simpler architecture than if we have two months. I'm transparent about the trade-offs: "This simpler approach will get us to market faster, but we may need to refactor if we add feature X later."