# Merkle Proofs

Merkle batches are deterministic:

- Leaves are normalized and lexicographically sorted
- Pairing uses left-right concatenation
- Odd leaves duplicate the last leaf

The resulting root becomes the anchorable proof surface for downstream chains.
