import { defineStore } from 'pinia'

export const useGrantProposalsStore = defineStore('grantProposals', {
  state: () => ({
    proposals: JSON.parse(localStorage.getItem('proposals')) || [], // Load proposals from localStorage or initialize as empty
  }),
  actions: {
    addProposal(proposal) {
      const newProposal = {
        ...proposal,
        id: Date.now().toString(), // Assign a unique ID
        status: 'pending', // Default status is "pending"
        rejectionNote: '', // Default rejection note
      }
      this.proposals.push(newProposal)
      localStorage.setItem('proposals', JSON.stringify(this.proposals)) // Persist changes
    },
    updateProposalStatus(id, status, note = '') {
      const proposal = this.proposals.find((p) => p.id === id)
      if (proposal) {
        proposal.status = status
        if (status === 'rejected') {
          proposal.rejectionNote = note // Save rejection note
        }
        localStorage.setItem('proposals', JSON.stringify(this.proposals)) // Persist changes
      }
    },
    getAdminProposals() {
      return this.proposals.filter((p) => p.status === 'accepted' || p.status === 'rejected')
    },
    getPendingProposals() {
      return this.proposals.filter((p) => p.status === 'pending')
    },
  },
})
