<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Uid\Ulid;
use ApiPlatform\Metadata\ApiFilter;
use App\Filter\CustomClientAccountFilter;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
class Client {
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $phone = null;

    #[ORM\Column]
    private ?bool $isValid = null;

    #[ORM\Column]
    private ?bool $isPrivileged = null;

    #[ApiFilter(CustomClientAccountFilter::class)]
    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $account = null;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: ManufacturingOrder::class)]
    private Collection $manufacturingOrders;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Palette::class)]
    private Collection $palettes;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Article::class, orphanRemoval: true)]
    private Collection $articles;

    public function __construct() {
        $this->manufacturingOrders = new ArrayCollection();
        $this->palettes = new ArrayCollection();
        $this->articles = new ArrayCollection();
    }

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): self {
        $this->name = $name;

        return $this;
    }

    public function getPhone(): ?string {
        return $this->phone;
    }

    public function setPhone(string $phone): self {
        $this->phone = $phone;

        return $this;
    }

    public function isIsValid(): ?bool {
        return $this->isValid;
    }

    public function setIsValid(bool $isValid): self {
        $this->isValid = $isValid;

        return $this;
    }

    public function isIsPrivileged(): ?bool {
        return $this->isPrivileged;
    }

    public function setIsPrivileged(bool $isPrivileged): self {
        $this->isPrivileged = $isPrivileged;

        return $this;
    }

    public function getAccount(): ?User {
        return $this->account;
    }

    public function setAccount(User $account): self {
        $this->account = $account;

        return $this;
    }

    /**
     * @return Collection<int, ManufacturingOrder>
     */
    public function getManufacturingOrders(): Collection {
        return $this->manufacturingOrders;
    }

    public function addManufacturingOrder(ManufacturingOrder $manufacturingOrder): self {
        if (!$this->manufacturingOrders->contains($manufacturingOrder)) {
            $this->manufacturingOrders->add($manufacturingOrder);
            $manufacturingOrder->setClient($this);
        }

        return $this;
    }

    public function removeManufacturingOrder(ManufacturingOrder $manufacturingOrder): self {
        if ($this->manufacturingOrders->removeElement($manufacturingOrder)) {
            // set the owning side to null (unless already changed)
            if ($manufacturingOrder->getClient() === $this) {
                $manufacturingOrder->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Palette>
     */
    public function getPalettes(): Collection {
        return $this->palettes;
    }

    public function addPalette(Palette $palette): self {
        if (!$this->palettes->contains($palette)) {
            $this->palettes->add($palette);
            $palette->setClient($this);
        }

        return $this;
    }

    public function removePalette(Palette $palette): self {
        if ($this->palettes->removeElement($palette)) {
            // set the owning side to null (unless already changed)
            if ($palette->getClient() === $this) {
                $palette->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Article>
     */
    public function getArticles(): Collection {
        return $this->articles;
    }

    public function addArticle(Article $article): self {
        if (!$this->articles->contains($article)) {
            $this->articles->add($article);
            $article->setClient($this);
        }

        return $this;
    }

    public function removeArticle(Article $article): self {
        if ($this->articles->removeElement($article)) {
            // set the owning side to null (unless already changed)
            if ($article->getClient() === $this) {
                $article->setClient(null);
            }
        }

        return $this;
    }
}
